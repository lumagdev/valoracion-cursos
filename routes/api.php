<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\AuthorController;
use App\Http\Controllers\Api\ReviewController;
use App\Http\Controllers\Api\TechnologyController;
use App\Http\Controllers\Api\UserController;
use App\Http\Controllers\Api\CourseController;
use App\Http\Controllers\Api\QuestionController;
use App\Http\Controllers\Api\AnswerController;
use App\Http\Controllers\ContactController;

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

// OJO: El orden de las rutas si importan en Laravel!!!!

// AUTH
Route::post('register', [AuthController::class, 'register'])->withoutMiddleware(['auth:sanctum']);
Route::post('login', [AuthController::class, 'login'])->withoutMiddleware(['auth:sanctum']);

// Course
Route::get('/courses', [CourseController::class, 'getAllCourses'])->name('courses.allCourses');
Route::get('/courses/top-courses', [CourseController::class, 'getTopHighestCourses'])->name('courses.topCourses');
Route::get('/courses/{id}', [CourseController::class, 'getCourseById'])->name('courses.courseById');
Route::get('/courses/count-reviews/{id}', [CourseController::class, 'getCourseReviewsCount'])->name('courses.totalReviewsByCourse');

// Technology
Route::get('/technologies', [TechnologyController::class, 'getAllTechnologies'])->name('technologies.allTechnologies');
Route::get('/technologies/{id}', [TechnologyController::class, 'getTechnologyById'])->name('technologies.technologyById');

//Review
Route::get('/reviews/reviews-by-course/{id}', [ReviewController::class, 'getAllReviewsOfACourse'])->name('reviews.allReviewsOfACourse');

//Author
Route::get('/authors/top-authors', [AuthorController::class, 'getTopHighestAuthors'])->name('authors.topAuthors');

//Question
Route::get('/questions/questions-by-course/{id}', [QuestionController::class, 'getQuestionsOfACourse'])->name('questions.questionsByCourse');

// Contact
Route::post('/contact', [ContactController::class, 'sendContactForm'])->name('contact.sendContact');

// --------------------------RUTAS QUE REQUIEREN AUTENTICACIÓN.
Route::middleware(['auth:sanctum'])->group(function ()
{
    Route::get('logout', [AuthController::class, 'logout']);

    /* -------------Rutas específicas para el rol de 'admin'------------------------ */
    Route::group(['middleware' => ['role:admin']], function () {
        // Agregar un rol al usuario especifico;
        Route::post('users/assign-role/{id}', [UserController::class, 'assignRole']);

        // User
        Route::get('/users', [UserController::class, 'getAllUsers'])->name('users.allUsers');
        Route::post('/users/create', [UserController::class, 'createUser'])->name('users.createUser');
        //Route::put('/users/update/{id}', [UserController::class, 'updateUser'])->name('users.updateUser');
        
        // Author
        Route::post('/authors/create', [AuthorController::class, 'createAuthor'])->name('authors.createAuthor');
        Route::get('/authors/{id}', [AuthorController::class, 'getAuthorById'])->name('authors.AuthorById');
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

        // Question
        Route::get('/questions', [QuestionController::class, 'getAllQuestions'])->name('questions.allQuestions');
        Route::post('/questions/create', [QuestionController::class, 'createQuestion'])->name('questions.createQuestion');
        Route::get('/questions/{id}', [QuestionController::class, 'getQuestionById'])->name('questions.questionById');
        Route::put('/questions/update/{id}', [QuestionController::class, 'updateQuestion'])->name('questions.updateQuestion');
        Route::delete('/questions/delete/{id}', [QuestionController::class, 'deleteQuestion'])->name('questions.deleteQuestion');

        // Answer
        Route::get('/answers', [AnswerController::class, 'getAllAnswers'])->name('answers.allAnswers');
        Route::post('/answers/create', [AnswerController::class, 'createAnswer'])->name('answers.createAnswer');
        Route::get('/answers/{id}', [AnswerController::class, 'getAnswerById'])->name('answers.answerById');
        Route::put('/answers/update/{id}', [AnswerController::class, 'updateAnswer'])->name('answers.updateAnswer');
        Route::delete('/answers/delete/{id}', [AnswerController::class, 'deleteAnswer'])->name('answers.deleteAnswer');
    });

    /* ---------------------------------- RUTAS ESPECÍFICAS PARA EL ROL "COMMON"----------------------------- */
    Route::group(['middleware' => ['role:common']], function () {
        // Users
        Route::put('/users/update/{id}', [UserController::class, 'updateUser'])->name('users.updateUser');
        // Reviews
        Route::get('/reviews/course/{courseId}/user/{userId}/questions-answers', [ReviewController::class, 'getQuestionsAndAnswersForUserReview'])->name('reviews.questionsAndAnswersForUserReview');
    });

    /*--------------------------------- RUTAS EN COMÚN---------------------------------------- */
    Route::get('/users/{id}', [UserController::class, 'getUserById'])->name('users.userById');
    Route::delete('/users/delete/{id}', [UserController::class, 'deleteUser'])->name('users.deleteUser');

    // Author
    Route::get('/authors', [AuthorController::class, 'getAllAuthors'])->name('authors.allAuthors');

    // Review N:M Course-User
    Route::post('/reviews/create', [ReviewController::class, 'createReview'])->name('reviews.createReview');
    Route::put('/reviews/update/{id}', [ReviewController::class, 'updateReview'])->name('reviews.updateReview');
    Route::delete('/reviews/delete/{id}', [ReviewController::class, 'deleteReview'])->name('reviews.deleteReview');
    Route::get('/reviews/reviews-by-user/{id}', [ReviewController::class, 'getAllReviewsOfAUser'])->name('reviews.allReviewsOfAUser');
});
