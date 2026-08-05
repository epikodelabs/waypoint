import { AngularNodeAppEngine, createNodeRequestHandler, isMainModule, writeResponseToNodeResponse } from '@angular/ssr/node';
import express, { type NextFunction, type Request, type Response } from 'express';
import path from 'node:path';
import { loadServerIndex, loadShard, resolveOutputPath, type Branch } from './compiler-output.js';
import { isAllowed, readPrincipal } from './route-auth.js';

const browserDistFolder = path.join(import.meta.dirname, '../browser');
const app = express();
const angularApp = new AngularNodeAppEngine({ allowedHosts: ['localhost', '127.0.0.1'] });
app.use(readPrincipal);

function requestedUrl(value: unknown): URL | null {
  if (typeof value !== 'string' || !value.trim()) return null;
  try { const url = new URL(value, 'http://waypoint.local'); return url.origin === 'http://waypoint.local' ? url : null; }
  catch { return null; }
}
function matches(pattern: string, pathname: string): boolean {
  const expected = pattern.split('/').filter(Boolean), actual = pathname.split('/').filter(Boolean);
  return expected.length === actual.length && expected.every((part, i) => part.startsWith(':') || part === actual[i]);
}
async function findBranch(pathname: string): Promise<Branch | undefined> {
  const index = await loadServerIndex();
  const candidates = [...index.shards].sort((a,b) => b.prefix.length-a.prefix.length)
    .filter(shard => pathname.startsWith(shard.prefix));
  for (const descriptor of candidates) {
    const shard = await loadShard(descriptor.file);
    const found = shard.branches.find(branch => matches(branch.path, pathname));
    if (found) return found;
  }
  return undefined;
}
function allowed(branch: Branch, request: Request): boolean { return branch.policies.every(policy => isAllowed(policy, request.principal)); }
async function descriptorFor(artifactKey: string) {
  const index = await loadServerIndex();
  const artifact = index.artifacts.find(item => item.artifactKey === artifactKey);
  if (!artifact?.file || !artifact.hash) return null;
  return { artifactKey, dependencies: artifact.dependencies, moduleUrl: `/api/navigation/modules/${encodeURIComponent(artifactKey)}.${artifact.hash}.js`, hash: artifact.hash, file: artifact.file };
}

app.get('/api/ping', (_req, res) => res.json({ ok: true, runtime: 'express', renderedAt: new Date().toISOString() }));
app.get('/api/navigation/resolve', async (req, res, next) => {
  try {
    const url = requestedUrl(req.query['path']); if (!url) return void res.status(400).json({ error: 'Invalid path.' });
    const branch = await findBranch(url.pathname); if (!branch?.routeSetId) return void res.status(404).json({ error: 'Route not found.' });
    if (!allowed(branch, req)) return void res.status(req.principal ? 403 : 401).json({ error: 'Route not authorized.' });
    const descriptor = await descriptorFor(branch.routeSetId); if (!descriptor) return void res.status(503).json({ error: 'Artifact unavailable.' });
    const { file: _file, ...publicDescriptor } = descriptor;
    res.set({ 'Cache-Control':'private, no-store', Vary:'Authorization, Cookie' }).json(publicDescriptor);
  } catch (e) { next(e); }
});
app.get('/api/navigation/artifacts/:artifactKey', async (req, res, next) => {
  try {
    const descriptor = await descriptorFor(req.params['artifactKey']); if (!descriptor) return void res.status(404).json({ error:'Artifact not found.' });
    const { file: _file, ...publicDescriptor } = descriptor; res.json(publicDescriptor);
  } catch (e) { next(e); }
});
app.get('/api/navigation/modules/:module', async (req, res, next) => {
  try {
    const match = /^(.+)\.([A-Za-z0-9_-]+)\.js$/.exec(req.params['module']); if (!match) return void res.status(404).end();
    const descriptor = await descriptorFor(decodeURIComponent(match[1]));
    if (!descriptor || descriptor.hash !== match[2]) return void res.status(404).end();
    res.set({ 'Cache-Control':'private, no-store', 'Content-Type':'text/javascript; charset=utf-8', Vary:'Authorization, Cookie', 'X-Content-Type-Options':'nosniff' });
    res.sendFile(resolveOutputPath(descriptor.file), error => { if (error && !res.headersSent) next(error); });
  } catch (e) { next(e); }
});

app.use(express.static(browserDistFolder, { maxAge:'1y', index:false, redirect:false }));
app.use('/api', (_req, res) => res.status(404).json({ error:'API route not found.' }));
app.use((req: Request, res: Response, next: NextFunction) => angularApp.handle(req).then(response => response ? writeResponseToNodeResponse(response,res) : next()).catch(next));
if (isMainModule(import.meta.url) || process.env['pm_id']) { const port=process.env['PORT']||4000; app.listen(port, error => { if(error) throw error; console.log(`Node Express server listening on http://localhost:${port}`); }); }
export const reqHandler = createNodeRequestHandler(app);
