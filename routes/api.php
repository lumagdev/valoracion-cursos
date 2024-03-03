<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AuthorController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\TechnologyController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CourseController;

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

// AUTH
Route::post('register', [AuthController::class, 'register'])->withoutMiddleware(['auth:sanctum']);
Route::post('login', [AuthController::class, 'login'])->withoutMiddleware(['auth:sanctum']);

// Course
Route::get('/courses', [CourseController::class, 'getAllCourses'])->name('courses.allCourses');
Route::get('/courses/{id}', [CourseController::class, 'getCourseById'])->name('courses.courseById');
// Technology
Route::get('/technologies', [TechnologyController::class, 'getAllTechnologies'])->name('technologies.allTechnologies');
Route::get('/technologies/{id}', [TechnologyController::class, 'getTechnologyById'])->name('technologies.technologyById');

// Rutas que requieren autenticacion.
Route::middleware(['auth:sanctum'])->group(function ()
{
    Route::get('logout', [AuthController::class, 'logout']);

    /* -------------Rutas específicas para el rol de 'admin'------------------------ */
    Route::group(['middleware' => ['role:admin']], function () {
        // Agregar un rol al usuario especifico;
        Route::post('users/assign-role/{id}', [UserController::class, 'assignRole']);

        // User
        Route::get('/users', [UserController::class, 'getAllUsers'])->name('users.allUsers');
        Route::get('/users/{id}', [UserController::class, 'getUserById'])->name('users.userById');
        Route::post('/users/create', [UserController::class, 'createUser'])->name('users.createUser');
        //Route::put('/users/update/{id}', [UserController::class, 'updateUser'])->name('users.updateUser');
        Route::delete('/users/delete/{id}', [UserController::class, 'deleteUser'])->name('users.deleteUser');
        
        // Author
        Route::get('/authors/{id}', [AuthorController::class, 'getAuthorById'])->name('authors.AuthorById');
        Route::post('/authors/create', [AuthorController::class, 'createAuthor'])->name('authors.createAuthor');
        Route::put('/authors/update/{id}', [AuthorController::class, 'updateAuthor'])->name('authors.updateAuthor');
        Route::delete('/authors/delete/{id}', [AuthorController::class, 'deleteAuthor'])->name('authors.deleteAuthor');
        
        // Technology
        Route::post('/technologies/create', [TechnologyController::class, 'createTechnology'])->name('technologies.createTechnology');
        Route::match(['post','put'],'/technologies/update/{id}', [TechnologyController::class, 'updateTechnology'])->name('technologies.updateTechnology');
        Route::delete('/technologies/delete/{id}', [TechnologyController::class, 'deleteTechnology'])->name('technologies.deleteTechnology');
    
        // Review
        Route::get('/reviews', [ReviewController::class, 'getAllReviews'])->name('reviews.allReviews');
        Route::get('/reviews/{id}', [ReviewController::class, 'getReviewById'])->name('reviews.reviewById');

        // Course
        Route::post('/courses/create', [CourseController::class, 'createCourse'])->name('courses.createCourse');
        Route::match(['post','put'],'/courses/update/{id}', [CourseController::class, 'updateCourse'])->name('courses.updateCourse');
        Route::delete('/courses/delete/{id}', [CourseController::class, 'deleteCourse'])->name('courses.deleteCourse');
    });

    /* ------------------- Rutas específicas para el rol de 'common'------------ */
    Route::group(['middleware' => ['role:common']], function () {
        
        // Users
        Route::put('/users/update/{id}', [UserController::class, 'updateUser'])->name('users.updateUser');
    });

    /*----------------- RUTAS EN COMÚN---------------------------------------- */
    // Author
    Route::get('/authors', [AuthorController::class, 'getAllAuthors'])->name('authors.allAuthors');

    // Review N:M Course-User
    Route::post('/reviews/create', [ReviewController::class, 'createReview'])->name('reviews.createReview');
    Route::put('/reviews/update/{id}', [ReviewController::class, 'updateReview'])->name('reviews.updateReview');
    Route::delete('/reviews/delete/{id}', [ReviewController::class, 'deleteReview'])->name('reviews.deleteReview');
});
