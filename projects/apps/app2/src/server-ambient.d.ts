declare module 'express' {
  interface ExpressApp {
    use: (...args: any[]) => void;
    get: (...args: any[]) => void;
    listen: (
      port: string | number,
      callback: (error?: unknown) => void,
    ) => void;
  }

  interface ExpressStaticOptions {
    maxAge?: string | number;
    index?: boolean;
    redirect?: boolean;
  }

  interface ExpressFactory {
    (): ExpressApp;
    json(): unknown;
    static(
      root: string,
      options?: ExpressStaticOptions,
    ): unknown;
  }

  const express: ExpressFactory;

  export default express;
}

declare module '@angular/ssr' {
  export const RenderMode: {
    readonly Server: 'server';
  };

  export interface ServerRoute {
    readonly path: string;
    readonly renderMode: unknown;
  }

  export function provideServerRendering(
    ...args: readonly unknown[]
  ): any;

  export function withRoutes(
    ...args: readonly unknown[]
  ): any;
}

declare module '@angular/ssr/node' {
  export class AngularNodeAppEngine {
    constructor(options?: unknown);
    handle(
      request: unknown,
    ): Promise<Response | null>;
  }

  export function createNodeRequestHandler(
    app: unknown,
  ): unknown;

  export function isMainModule(
    url: string,
  ): boolean;

  export function writeResponseToNodeResponse(
    response: Response,
    nodeResponse: unknown,
  ): void;
}

declare module 'node:path' {
  export function join(
    ...parts: readonly string[]
  ): string;
}

interface ImportMeta {
  readonly dirname: string;
}

declare const process: {
  readonly env: Record<
    string,
    string | undefined
  >;
};
