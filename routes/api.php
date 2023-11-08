<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AuthorController;
use App\Http\Controllers\Api\UserController;

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

    //Rutas User
    Route::get('/users', [UserController::class, 'getAllUsers'])->name('users.allUsers');
    Route::get('/users/{id}', [UserController::class, 'getUserById'])->name('users.userById');
    Route::post('/users/create', [UserController::class, 'createUser'])->name('users.createUser');
    Route::put('/users/update/{id}', [UserController::class, 'updateUser'])->name('users.updateUser');
    Route::delete('/users/delete/{id}', [UserController::class, 'deleteUser'])->name('users.deleteUser');

    //Rutas Author
    Route::get('/authors', [AuthorController::class, 'getAllAuthors'])->name('authors.allAuthors');
    Route::get('/authors/{id}', [AuthorController::class, 'getAuthorById'])->name('authors.AuthorById');
    Route::post('/authors/create', [AuthorController::class, 'createAuthor'])->name('authors.createAuthor');
    Route::put('/authors/update/{id}', [AuthorController::class, 'updateAuthor'])->name('authors.updateAuthor');
    Route::delete('/authors/delete/{id}', [AuthorController::class, 'deleteAuthor'])->name('authors.deleteAuthor');
});
