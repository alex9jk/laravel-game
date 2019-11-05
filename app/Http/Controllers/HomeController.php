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
        //\DB::table('games')->where('gameState', '=', 'challenge')->where('player1ID','=',$user->id)->orWhere('player2ID','=',$user->id)->delete();
        $user->playerStatus = "waiting";
        $user->save();
        $messages = Message::whereNull('game_id')->get();
        $games = \DB::table('games')->where('player1ID','=',$user->id)->orWhere('player2ID','=',$user->id)->get();
        return view('home',['user'=>$user,'messages'=>$messages,'games' =>$games]);
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

        if($waitingUsers == null || $waitingUsers->count() != 1){
            return response()->json([
                'success'  => false
                ]);
        }
       return response()->json([
        'success'  => true,
        'data' => $waitingUsers
    
        ]);

    }

    public function getChallengeAccepted(Request $request){

        // $this->validate( $request,[
        //     'gameid' => 'required',
        // ]);
         $user = Auth::user();  
        $game= Game::where("player1ID","=",$user->id)->where("gameState","=","playing")->get();
        if($game == null || $game->count() != 1){
            return response()->json([
                'success'  => false,
                'data' => $user
                ]);
        }
       return response()->json([
        'success'  => true,
        'data' => $game
    
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

public function joinGame(Request $request){
    $this->validate( $request,[
        'gameid' => 'required',
    ]);
    $user = Auth::user();  
    $game= Game::where("id","=",$request->gameid)->where("gameState","=","challenge")->first();
   
    if($game == null || $game->count() != 1){
        return response()->json([
            'success'  => false
            ]);
    }
    $game->gameState = "playing";
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
