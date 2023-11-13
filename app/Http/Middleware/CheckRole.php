<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class CheckRole
{
    /**
     * Handle an incoming request.
     *
     * @param  \Closure(\Illuminate\Http\Request): (\Symfony\Component\HttpFoundation\Response)  $next
     */
    // Esto verifica si el usuario autenticado tiene al menos uno de los roles asignados
    public function handle(Request $request, Closure $next, ...$roles)
    {
        if ($request->user() && $request->user()->hasAnyRole($roles)) {
            return $next($request);
        }

        return response()->json(['message' => 'Unauthorized access.'], 403);
    }
}
