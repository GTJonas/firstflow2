<?php

use App\Http\Controllers\CompanyController;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\ProtectedController;
use \App\Http\Controllers\TokenController;
use App\Http\Controllers\PostController;
use App\Http\Controllers\UsersController;
use App\Http\Controllers\SchoolClassController;

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

// Routes that do not require authentication
Route::post('/login', [AuthController::class, 'login']);

Route::get('/protected', [ProtectedController::class, 'index']);
Route::post('/check-token', [TokenController::class, 'checkToken']);
Route::get('/get-user-by-uuid/{uuid}', [UsersController::class, 'getUserByUuid']);
Route::post('/update-user-profile', [UsersController::class, 'updateUserProfile']);

Route::get('/user-by-roles', [UsersController::class, 'UserSortedbyRoles']);

// these are currently not used. as for filterd post will have the ability of doing it
Route::get('/all-posts', [PostController::class, 'allPosts']);
Route::get('/own-posts', [PostController::class, 'ownPosts']);

Route::get('/students-in-class-post/{classId}', [PostController::class, 'studentsInClassPost']);
Route::get('/show-po/{teacherId}', [PostController::class, 'showPosts']);

//Posts and filter options
Route::post('/store-post', [PostController::class, 'store']);
Route::get('/filtered-posts', [PostController::class, 'getFilteredPosts']);
Route::get('/getClasses', [PostController::class, 'getClasses']);
Route::get('/getUsersForClass/{classId}', [PostController::class, 'getUsersForClass']);

// Route to accept a post
Route::post('posts/{postId}/accept', [PostController::class, 'acceptPost']);

// Route to decline a post
Route::post('posts/{postId}/decline', [PostController::class, 'declinePost']);


//Class
Route::post('/create-class', [SchoolClassController::class, 'createClass']);
Route::get('/show-class-from-school', [SchoolClassController::class, 'showClassFromSchool']);
Route::get('/show-own-class', [SchoolClassController::class, 'showOwnClass']);
Route::put('/change-company', [SchoolClassController::class, 'ChangeCompanyforUser']);

Route::put('/assign-students-to-class', [SchoolClassController::class, 'assignStudentsToClass']);

Route::put('/detach-students-from-class', [SchoolClassController::class, 'detachStudentsFromClass']);

Route::get('/get-all-students-from-school/{schoolId}', [SchoolClassController::class, 'getAllStudentsFromSchool']);

Route::post('/store-company', [CompanyController::class, 'store']);
Route::post('/company/edit/{uuid}', [CompanyController::class, 'editCompanyProfile']);
Route::get('/company/show/{uuid}', [CompanyController::class, 'showCompanyProfile']);
Route::get('/company/own-profile', [CompanyController::class, 'redirectOwnCompanyProfile']);
Route::get('/company/all/show', [CompanyController::class, 'showAllCompanyProfiles']);
Route::get('/search-company', [CompanyController::class, 'searchCompany']);

Route::post('/favorite-company/{companyId}', [CompanyController::class, 'favoriteCompany']);
Route::post('/remove-favorite-company/{companyId}', [CompanyController::class, 'removeFavoriteCompany']);





