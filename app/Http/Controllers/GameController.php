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
     * Display a listing of the resource.
     *
     * @return \Illuminate\Http\Response
     */
    public function index()
    {
        $user = Auth::user();
        $game = new Game();
        $game->player1ID = $user->id;
        $game->gameState = 'waiting';
        $game->save();
        return view('game.playgame',['user'=>$user,'game'=>$game]);

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
    public function getLobbyMessages(Request $request){
        $this->validate( $request,[
            'gameid' => 'required'
        ]);
        $user = Auth::user();  
        $messages = Message::where('game_id',"=",$request->gameid)->get();
        
     if(sizeof($messages) > 0){
        foreach($messages as $message){  
           $message->name = User::where("id","=",$user->id)->get();
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
