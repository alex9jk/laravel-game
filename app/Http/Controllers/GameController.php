<?php

namespace App\Http\Controllers;

use App\Game;
use App\Message;
use App\User;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;
use Auth;

class GameController extends Controller
{
    /**
     * 
     * returns game view with board set up
     * @return game view
     */
    public function index($id)
    {
        $user = Auth::user();
        $game = Game::where('gameState', '=', 'playing')->where('player1ID','=',$user->id)->orWhere('player2ID','=',$user->id)->first();
        //set up array of arrays for board 
        //array with 6 arrays in it with 7 0s
        //set values in array to 0
        //JSON.stringify()
        if($game == null || $game->count() != 1){
            return redirect('/home');
        }
        
        return view('game.playgame',['user'=>$user,'game'=>$game]);
      //  return view('game.playgame');
    }
    public function checkStatus(Request $request){

        $this->validate( $request,[
            'id' => 'required',
        ]);

        $game = Game::where("id",$request['id'])->first();

        return response()->json([
            'success'  => true,
            'data' => $game
        ]);
    }

            /**
     * 
     *Posts message to game chat from form
     *@param request object
     * @return if messaged gets saved to database returns success
     */
    public function chat(Request $request){

        $this->validate( $request,[
            'message' => 'required',
            'gameid' => 'required'
        ]);
        $user = Auth::user();
        
        $message = new Message();
        
        $message->user_id = $user->id;
        $message->messageText = $request->message;
        $message->game_id = $request->gameid;
        $message->save();
        return response()->json([
            'success'  => true
        ]);
    }

            /**
     * 
     *Gets messages from database for the game chat --gets all messages with current gameid
     * @param request object
     * @return json messages object
     */
    public function getLobbyMessages(Request $request){
        $this->validate( $request,[
            'gameid' => 'required'
        ]);
        $user = Auth::user();  
        $messages = Message::where('game_id',"=",$request->gameid)->get();
        
     if(sizeof($messages) > 0){
        foreach($messages as $message){  
           $message->name = User::where("id","=",$message->user_id)->first()->name;
        }
        return response()->json([
            'success'  => true,
            'data' => $messages
        ]);
     }
     else {
        return response()->json([
            'success'  => false
        ]);
     }   
    }

    public function quitGame(Request $request){
        $this->validate( $request,[
            'id' => 'required'
        ]);
        
        $game = Game::where('id',"=",$request->id)->first();
        $game->gameState = "forfeit";

        if($game->player1ID == Auth::id()){
            $game->winner = $game->player2ID;
        }
        else if($game->player2ID == Auth::id()){
            $game->winner = $game->player1ID;

        }
        $game->save();
        if($game == null || $game->count() != 1 || $game->winner == null){
            return response()->json([
                'success'  => false
                
                ]);
        }
       return response()->json([
        'success'  => true,
        'data' => $game
    
        ]);
    }

    public function gameState(Request $request){
        $this->validate( $request,[
            'id' => 'required'
        ]);
        
        $game = Game::where('id',"=",$request->id)->get();

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
     * Show the form for creating a new resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function create()
    {
        //
    }

    /**
     * Store a newly created resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function store(Request $request)
    {
        //
    }

    /**
     * Display the specified resource.
     *
     * @param  \App\Game  $game
     * @return \Illuminate\Http\Response
     */
    public function show(Game $game)
    {
        //
    }

    /**
     * Show the form for editing the specified resource.
     *
     * @param  \App\Game  $game
     * @return \Illuminate\Http\Response
     */
    public function edit(Game $game)
    {
        //
    }

    /**
     * Update the specified resource in storage.
     *
     * @param  \Illuminate\Http\Request  $request
     * @param  \App\Game  $game
     * @return \Illuminate\Http\Response
     */
    public function update(Request $request, Game $game)
    {
        //
    }

    /**
     * Remove the specified resource from storage.
     *
     * @param  \App\Game  $game
     * @return \Illuminate\Http\Response
     */
    public function destroy(Game $game)
    {
        //
    }
}
