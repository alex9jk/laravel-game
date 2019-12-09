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
     * 
     *Sets up player in lobby and populates initial chat window
     * @return view for home page along with user info, chat messages and game stats
     */
    public function index()
    {
        
        $user = Auth::user();
        //\DB::table('games')->where('gameState', '=', 'challenge')->where('player1ID','=',$user->id)->orWhere('player2ID','=',$user->id)->delete();
        $user->playerStatus = "waiting";
        $user->touch();
        $user->save();
        $messages = Message::whereNull('game_id')->get();
        $games = \DB::table('games')->where('player1ID','=',$user->id)->orWhere('player2ID','=',$user->id)->get();
        return view('home',['user'=>$user,'messages'=>$messages,'games' =>$games]);
    }

        /**
     * 
     *Posts message to lobby chat from form
     *@param request object
     * @return if messaged gets saved to database returns success
     */
    public function chat(Request $request){

        $this->validate( $request,[
            'message' => 'required',
            
        ]);
        $user = Auth::user();
        
        $message = new Message();
        
        $message->user_id = $user->id;
        $message->messageText = strip_tags($request->message);
        $message->save();
        return response()->json([
            'success'  => true
        ]);
    }
        /**
     * 
     *Gets messages from database for the lobby chat --gets all messages that don't have a gameid associated with it
     * @param request object
     * @return json messages object
     */
    public function getLobbyMessages(Request $request){

        $user = Auth::user();  
        $messages = Message::whereNull('game_id')->get();

        if($messages == null || $messages->count() <1) {
            return response()->json([
                'success'  => false
                ]);
        }
        foreach($messages as $message){
            $message->name = User::where('id',"=",$user->id)->get();
        }
        return response()->json([
            'success'  => true,
            'data' => $messages
        ]);

    }
    /**
     * gets all users in lobby who aren't playing a game or havn't been challenged
     *@param request object
     * @return array of users
     */
    public function getLobbyUsers(Request $request){

        $user = Auth::user();  
        $waitingUsers = User::where('id',"!=",$user->id)->where("playerStatus","=","waiting")->whereBetween('updated_at', [now()->subMinutes(30), now()])->get();

        if($waitingUsers == null || $waitingUsers->count() < 1){
            return response()->json([
                'success'  => false
                ]);
        }
       return response()->json([
        'success'  => true,
        'data' => $waitingUsers
    
        ]);

    }
    /**
     * 
     *determines wheather challenge has been accepted by other user
     *@param request object
     * @return all associated game info
     */
    public function getChallengeAccepted(Request $request){

        // $this->validate( $request,[
        //     'gameid' => 'required',
        // ]);
         $user = Auth::user();  
        $game= Game::where("player1ID","=",$user->id)->where("gameState","=","playing")->get();
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
     /**
     * creates a new game and sets the challenger and person being challenged
     *@param request object
     * @return game data
     */

 public function challengeUser(Request $request){

    $this->validate( $request,[
        'challenge' => 'required',
    ]);
    $user = Auth::user();  
    \DB::table('games')->where('gameState', '=', 'challenge')->orWhere('player1ID','=',$user->id)->delete();
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
    /**
     * if you've been challenged this is where you accept challenge and start a new game
     *@param request object
     * @return game data
     */
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

    /**
     * user is waiting for response from other user if they want to join game
     *@param request object
     * @return game data
     */

public function getChallenges(Request $request){

    $user = Auth::user();  
    $game= Game::where("player2ID","=",$user->id)->where("gameState","=","challenge")->first();
    if($game != null){
        $challenger = User::where('id','=',$game->player1ID)->first();
        $game->challenger = $challenger->name;
    }


   
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
