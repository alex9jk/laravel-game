<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use App\User;
use App\Message;

class HomeController extends Controller
{
    /**
     * Create a new controller instance.
     *
     * @return void
     */
    public function __construct()
    {
        $this->middleware('auth');
    }

    /**
     * Show the application dashboard.
     *
     * @return \Illuminate\Contracts\Support\Renderable
     */
    public function index()
    {
        $user = Auth::user();
        $messages = Message::whereNull('game_id')->get();
        return view('home',['user'=>$user,'messages'=>$messages]);
    }
    public function chat(Request $request){

        $validatedData = $request->validate([
            'message' => 'required',
        ]);
        $user = Auth::user();
        
        $message = new Message();
        
        $message->user_id = $user->id;
        $message->messageText = $request->message;
        $message->save();
        $messages = Message::whereNull('game_id')->get();
        return view('home',['user'=>$user,'messages'=>$messages]);

    }
}
