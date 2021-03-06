<?php

/*
|--------------------------------------------------------------------------
| Web Routes
|--------------------------------------------------------------------------
|
| Here is where you can register web routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| contains the "web" middleware group. Now create something great!
|
*/

// Route::get('/', function () {
//     return view('welcome');
// });

Auth::routes();
Route::get('/home', 'HomeController@index')->name('home');

Route::group(['middleware' => 'auth'], function () { 


    
    Route::get('/playgame/{id}', [
        'uses'=>'GameController@index',
        'as' => 'game.playgame'
    ]);
    
    Route::post('/checkStatus', [
        'uses'=>'GameController@checkStatus',
        
    ]);

    Route::post('/home', [
        'uses'=>'MessageController@checkMessages',
        
    ]);
    Route::post('/lobbyUsers', [
        'uses'=>'HomeController@getLobbyUsers',
        
    ]);
    Route::post('/getLobbyChat', 'HomeController@getLobbyMessages');
    Route::post('/sendChatData', 'HomeController@chat');
    Route::post('/checkChallengeAccepted', 'HomeController@getChallengeAccepted');
    Route::post('/challengeUser', 'HomeController@challengeUser');
    Route::post('/getChallenges', 'HomeController@getChallenges');
    Route::post('/joinGame', 'HomeController@joinGame');
    Route::post('/denyGame', 'HomeController@denyGame');
    Route::post('/userInactive', 'HomeController@userInactive');
    Route::post('/userActive', 'HomeController@userActive');
    
    
    Route::post('/getGameChat', 'GameController@getLobbyMessages');
    Route::post('/sendGameData', 'GameController@chat');
    Route::post('/quitGame', 'GameController@quitGame');
    Route::post('/gameState', 'GameController@gameState');
    Route::post('/legalMove', 'GameController@isLegaLMove');
    Route::post('/updateBoard', 'GameController@updateBoard');
    Route::post('/checkTurn', 'GameController@checkTurn');
    Route::post('/playPiece', 'GameController@playPiece');
    Route::post('/checkWinner', 'GameController@checkWinnerGame');



    Route::get('/', 'HomeController@profile')->name('profile');
    
    

    
});


