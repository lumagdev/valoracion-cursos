<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\Auth;
use App\Http\Controllers\Api\AuthController;
/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider and all of them will
| be assigned to the "api" middleware group. Make something great!
|
*/

Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
    return $request->user();
});
// AUTH
Route::post('register', [AuthController::class, 'register']);
Route::post('login', [AuthController::class, 'login']);
// Rutas que requieren autenticacion.
Route::middleware(['auth:sanctum'])->group(function ()
{
    Route::get('logout', [AuthController::class, 'logout']);
});
