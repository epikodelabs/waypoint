/*
Do not add a Waypoint-specific watch option.

The generated schema already inherits Angular's ordinary:

  watch: boolean

Waypoint must honor that exact option so:

  ng build app2-client --watch

works naturally.
*/
