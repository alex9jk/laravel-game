<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Auth;
use App\User;
use App\Message;
use App\Game;

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
        $user->playerStatus = "waiting";
        $user->save();
        $messages = Message::whereNull('game_id')->get();
        return view('home',['user'=>$user,'messages'=>$messages]);
    }
    public function chat(Request $request){

        $this->validate( $request,[
            'message' => 'required',
        ]);
        $user = Auth::user();
        
        $message = new Message();
        
        $message->user_id = $user->id;
        $message->messageText = $request->message;
        $message->save();
        return response()->json([
            'success'  => true
        ]);
    }
    public function getLobbyMessages(Request $request){

        $user = Auth::user();  
        $messages = Message::whereNull('game_id')->get();
        foreach($messages as $message){
            $message->name = User::where('id',"=",$user->id)->get();
        }
        return response()->json([
            'success'  => true,
            'data' => $messages
        ]);

    }

    public function getLobbyUsers(Request $request){

        $user = Auth::user();  
        $waitingUsers = User::where('id',"!=",$user->id)->where("playerStatus","=","waiting")->get();
        return response()->json([
            'success'  => true,
            'data' => $waitingUsers
        ]);

    }

    public function getChallengeAccepted(Request $request){


       return response()->json([
        'success'  => true

    ]);
 }

 public function challengeUser(Request $request){

    $this->validate( $request,[
        'challenge' => 'required',
    ]);
    $user = Auth::user();  
    $game = new Game();
    $game->player1ID = $user->id;
    $game->player2ID = (int) $request->challenge;
    $game->gameState = "challenge";
    $game->save();
   return response()->json([
    'success'  => true,
    'data' => $game

    ]);
}

public function getChallenges(Request $request){

    $user = Auth::user();  
    $game= Game::where("player2ID","=",$user->id)->where("gameState","=","challenge")->first();
   
    if($game == null || $game->count() != 1){
        return response()->json([
            'success'  => false
            ]);
    }
   return response()->json([
    'success'  => true,
    'data' => $game

    ]);
}
    
}
