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
    Route::get('/playgame', [
        'uses'=>'GameController@index',
        'as' => 'game.playgame'
    ]);
    
    Route::post('/checkStatus', [
        'uses'=>'GameController@checkStatus',
        
    ]);

    Route::post('/home', [
        'uses'=>'MessageController@checkMessages',
        
    ]);
    Route::post('/getLobbyChat', 'HomeController@getLobbyMessages');
    Route::post('/sendChatData', 'HomeController@chat');
});
Route::get('/home', 'HomeController@index')->name('home');

