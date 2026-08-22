using Microsoft.AspNetCore.Http.Headers;
using WaypointServer;

var builder = WebApplication.CreateBuilder(args);
builder.Services.AddSingleton<WaypointSnapshotSource>();
builder.Services.AddSingleton<WaypointRouter>();
builder.Services.AddSingleton<DemoPrincipalStore>();

var app = builder.Build();

app.UseDefaultFiles();
app.UseStaticFiles();

app.Use(async (context, next) =>
{
    context.Items[DemoPrincipalStore.PrincipalItemKey] =
        app.Services.GetRequiredService<DemoPrincipalStore>().Read(context.Request);
    await next();
});

app.MapGet("/api/ping", () => Results.Ok(new
{
    ok = true,
    runtime = "aspnet-core",
    renderedAt = DateTimeOffset.UtcNow
}));

app.MapGet("/api/navigation/resolve", async (
    HttpContext http,
    WaypointRouter router,
    string? target,
    CancellationToken cancellationToken) =>
{
    NoStore(http.Response);

    if (string.IsNullOrWhiteSpace(target))
        return Results.BadRequest(new { error = "Invalid path." });

    var resolution = await router.ResolveAsync(
        target,
        Principal(http),
        cancellationToken);

    // Unknown and unauthorized intentionally have the same public result.
    return resolution is null
        ? Results.NotFound(new { error = "Route not found." })
        : Results.Ok(resolution);
});

app.MapGet("/api/navigation/configuration", async (
    HttpContext http,
    WaypointRouter router,
    CancellationToken cancellationToken) =>
{
    NoStore(http.Response);

    var principal = Principal(http);
    var configuration = await router.ResolveConfigurationAsync(
        principal,
        cancellationToken);

    var landing = await router.ResolveLandingAsync(
        ["/app/admin", "/app/settings?section=access", "/"],
        principal,
        cancellationToken);

    return Results.Ok(configuration with { Landing = landing });
});

app.MapGet("/api/navigation/modules/{artifactKey}/{hash}", async (
    HttpContext http,
    WaypointRouter router,
    string artifactKey,
    string hash,
    CancellationToken cancellationToken) =>
{
    NoStore(http.Response);

    var artifact = await router.ResolveModuleAsync(
        artifactKey,
        hash,
        Principal(http),
        cancellationToken);

    if (artifact?.File is not { Length: > 0 } relativeFile)
        return Results.NotFound();

    var path = router.ResolveOutputPath(relativeFile);
    if (!File.Exists(path))
        return Results.NotFound();

    http.Response.Headers.XContentTypeOptions = "nosniff";
    return Results.File(
        path,
        contentType: "text/javascript; charset=utf-8",
        enableRangeProcessing: false);
});

app.MapPost("/api/session/principal", async (
    HttpContext http,
    DemoPrincipalStore principals,
    WaypointRouter router,
    PrincipalRequest request,
    CancellationToken cancellationToken) =>
{
    NoStore(http.Response);

    var profile = principals.Profile(request.Identity);
    if (profile is null)
        return Results.BadRequest(new { error = "Unknown demo principal." });

    var landing = await router.ResolveLandingAsync(
        profile.LandingTargets,
        profile.Principal,
        cancellationToken);

    if (landing is null)
        return Results.StatusCode(StatusCodes.Status403Forbidden);

    http.Response.Cookies.Append("identity", profile.Id, new CookieOptions
    {
        Path = "/",
        SameSite = SameSiteMode.Lax,
        HttpOnly = true,
        Secure = http.Request.IsHttps
    });

    return Results.Ok(new { location = landing });
});

app.MapPost("/api/navigation/reload", async (
    HttpContext http,
    DemoPrincipalStore principals,
    WaypointRouter router,
    ReloadRequest request,
    CancellationToken cancellationToken) =>
{
    NoStore(http.Response);

    if (request.Reason is not ("reset" or "principal-change"))
        return Results.BadRequest(new { error = "Invalid reload reason." });

    var principal = Principal(http);

    if (request.Reason == "principal-change")
    {
        http.Response.Cookies.Delete("identity", new CookieOptions { Path = "/" });
        http.Response.Headers["Clear-Site-Data"] = "\"cache\"";
        principal = null;
    }

    if (!string.IsNullOrWhiteSpace(request.Target) &&
        await router.ResolveAsync(request.Target, principal, cancellationToken) is not null)
        return Results.Ok(new { location = request.Target });

    var fallbacks = request.Reason == "principal-change"
        ? new[] { "/?account=choose" }
        : new[] { "/app/admin", "/app/settings?section=access", "/" };

    var landing = await router.ResolveLandingAsync(
        fallbacks,
        principal,
        cancellationToken);

    return landing is null
        ? Results.StatusCode(StatusCodes.Status403Forbidden)
        : Results.Ok(new { location = landing });
});

app.MapFallbackToFile("index.html");
app.Run();

static ServerPrincipal? Principal(HttpContext context) =>
    context.Items.TryGetValue(DemoPrincipalStore.PrincipalItemKey, out var value)
        ? value as ServerPrincipal
        : null;

static void NoStore(HttpResponse response)
{
    response.Headers.CacheControl = "private, no-store";
    response.Headers.Vary = "Authorization, Cookie";
}

public sealed record PrincipalRequest(string? Identity);
public sealed record ReloadRequest(string? Reason, string? Target);
