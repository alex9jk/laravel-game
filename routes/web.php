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

Route::get('/', function () {
    return view('welcome');
});

Auth::routes();

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

    Route::post('/getGameChat', 'GameController@getLobbyMessages');
    Route::post('/sendGameData', 'GameController@chat');
    Route::post('/quitGame', 'GameController@quitGame');
    Route::post('/gameState', 'GameController@gameState');

    
});
Route::get('/home', 'HomeController@index')->name('home');

