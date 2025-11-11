import { NextMiddleware, NextResponse, NextRequest, NextFetchEvent } from 'next/server';

type MiddlewareFactory = (middleware: NextMiddleware) => NextMiddleware;

export function chain(middlewares: MiddlewareFactory[]) {
  return async function middleware(request: NextRequest, event: NextFetchEvent) {
    // Crear un middleware base que simplemente continúa la cadena
    const baseMiddleware: NextMiddleware = () => NextResponse.next();
    
    // Encadenar todos los middlewares en orden inverso
    const handler = middlewares.reduceRight(
      (next, middleware) => middleware(next),
      baseMiddleware
    );

    return handler(request, event);
  };
} 