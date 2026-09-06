<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class EnsureUserIsAdmin
{
    public function handle(Request $request, Closure $next): Response
    {
        ([
            'user_id' => $request->user()?->id,
            'name' => $request->user()?->name,
            'email' => $request->user()?->email,
            'role' => $request->user()?->role,
            'is_admin' => $request->user()?->isAdmin(),
        ]);

        if (! $request->user() || ! $request->user()->isAdmin()) {
            abort(403, 'Hanya admin yang boleh mengakses halaman ini.');
        }

        return $next($request);
    }
}