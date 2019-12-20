<?php

namespace App\Http\Controllers;

use App\Game;
use App\Message;
use App\User;
use Illuminate\Http\Request;
use Illuminate\Support\Arr;
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
        $user->playerStatus = "playing";
        $user->save();
        $game = Game::where('id','=',$id)->first();
        $userArray = array($game->player1ID,$game->player2ID);
        $random = Arr::random($userArray);
        $game->playerTurn = $random;
        //set up array of arrays for board 
        //array with 6 arrays in it with 7 0s
        //set values in array to 0
        $boardArray = array();
        for($i=0;$i<6;$i++){
            $subArray = array();
            
            for($j=0;$j<7;$j++){
                $subArray[$j] = 0;
            }
            $boardArray[$i] = $subArray;
        }
        $game->boardArray = json_encode($boardArray);
        $game->save();
        if($game == null){
            return redirect('/home');
        }
        if($game->player1ID != $user->id && $game->player2ID != $user->id){
            return redirect('/home');
        }           
        return view('game.playgame',['user'=>$user,'game'=>$game]);
      //  return view('game.playgame');
    }
                /**
     * 
     *Checks the status of the game
     *@param request object
     * @return json with game data
     */
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
        $message->messageText = strip_tags($request->message);
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
            /**
     * 
     *Once a player has forfeited update the database to reflect the gamestate and the winner of the game
     *@param request object
     * @return if the game is over return true with game data if not return false
     */
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
        if($game == null || $game->winner == null){
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
     * 
     *Gets the state of the game
     *@param request object
     * @return if there is a game return true with game data if not return false
     */
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
     * 
     *checks the winner of the game by calling all connect 4 checks
     * @param board array
     * @return 1 for player 1 connect 4 and 2 for player 2  connect 4
     */
    public function checkWinner($board){
        $win = false;
        if($win == false){
            $win =  $this->northWest($board);
        }
        if($win == false){
            $win =  $this->northEast($board);
        }
        if($win == false){
            $win =  $this->checkHorizontal($board);
        }
        if($win == false){
            $win =  $this->checkVertical($board);
        }
        return $win;
    }

                /**
     * 
     *checks whether there is connect 4 match diagnolly from top left to bottom right
     * @param board array
     * @return 1 for player 1 connect 4 and 2 for player 2  connect 4
     */
    public function northWest($board){
        for($x =sizeof($board[0])-1; $x>=0;$x--){ 
          for($y = sizeof($board) -1; $y>=0; $y--){
            if(isset($board[$y][$x]) && $board[$y][$x] == "1" && isset($board[$y-1][$x-1]) && $board[$y-1][$x-1] == "1" && isset($board[$y-2][$x-2]) && $board[$y-2][$x-2] == "1" && isset($board[$y-3][$x-3]) && $board[$y-3][$x-3] == "1" ){
              return 1;
            }
            if(isset($board[$y][$x]) && $board[$y][$x] == "2" && isset($board[$y-1][$x-1]) && $board[$y-1][$x-1] == "2" && isset($board[$y-2][$x-2]) && $board[$y-2][$x-2] == "2" && isset($board[$y-3][$x-3]) && $board[$y-3][$x-3] == "2" ){
                return 2;
              }
          }
        }
        return false;   
      }
                      /**
     * 
     *checks whether there is connect 4 match diagnolly from top right to bottom left
     * @param board array
     * @return 1 for player 1 connect 4 and 2 for player 2  connect 4
     */
      public function northEast($board){
        for($x =sizeof($board[0])-1; $x>=0;$x--){
          for($y = sizeof($board) -1; $y>=0; $y--){
            if(isset($board[$y][$x]) && $board[$y][$x] == "1" && isset($board[$y-1][$x+1]) && $board[$y-1][$x+1] == "1" && isset($board[$y-2][$x+2]) && $board[$y-2][$x+2] == "1" && isset($board[$y-3][$x+3]) && $board[$y-3][$x+3] == "1" ){
              return 1;
            }
            if(isset($board[$y][$x]) && $board[$y][$x] == "2" && isset($board[$y-1][$x+1]) && $board[$y-1][$x+1] == "2" && isset($board[$y-2][$x+2]) && $board[$y-2][$x+2] == "2" && isset($board[$y-3][$x+3]) && $board[$y-3][$x+3] == "2" ){
                return 2;
              }
          }
        }
        return false; 
      }
                      /**
     * 
     *checks whether there is connect 4 match horizontally
     * @param board array
     * @return 1 for player 1 connect 4 and 2 for player 2  connect 4
     */
    public function checkHorizontal($board) {
        for($x =sizeof($board[0])-1; $x>=0;$x--){
            for($y = sizeof($board) -1; $y>=0; $y--){
              if(isset($board[$y][$x]) && $board[$y][$x] == "1" && isset($board[$y][$x-1]) && $board[$y][$x-1] == "1" && isset($board[$y][$x-2]) && $board[$y][$x-2] == "1" && isset($board[$y][$x-3]) && $board[$y][$x-3] == "1" ){
                return 1;
              }
              if(isset($board[$y][$x]) && $board[$y][$x] == "2" && isset($board[$y][$x-1]) && $board[$y][$x-1] == "2" && isset($board[$y][$x-2]) && $board[$y][$x-2] == "2" && isset($board[$y][$x-3]) && $board[$y][$x-3] == "2" ){
                  return 2;
                }
            }
          }
          return false;   
      }
                  /**
     * 
     *checks whether there is connect 4 match vertically
     * @param board array
     * @return 1 for player 1 connect 4 and 2 for player 2  connect 4
     */
      public function checkVertical($board) {
        for($x =sizeof($board[0])-1; $x>=0;$x--){
            for($y = sizeof($board) -1; $y>=0; $y--){
              if(isset($board[$y][$x]) && $board[$y][$x] == "1" && isset($board[$y-1][$x]) && $board[$y-1][$x] == "1" && isset($board[$y-2][$x]) && $board[$y-2][$x] == "1" && isset($board[$y-3][$x]) && $board[$y-3][$x] == "1" ){
                return 1;
              }
              if(isset($board[$y][$x]) && $board[$y][$x] == "2" && isset($board[$y-1][$x]) && $board[$y-2][$x] == "2" && isset($board[$y-2][$x]) && $board[$y-2][$x] == "2" && isset($board[$y-3][$x]) && $board[$y-3][$x] == "2" ){
                  return 2;
                }
            }
          }
          return false;
      }
                      /**
     * 
     *All operations involved in playing a piece -updating whos turn it is, checking if legal move
     * @param request object
     * @return game data
     */
    public function playPiece(Request $request){
        $this->validate( $request,[
            'xcoord' => 'required',
            'game_id' => 'required'
        ]);
        $game = Game::where('id',"=",$request->game_id)->first();
        $board = json_decode($game->boardArray);
        $user = Auth::user(); 
        //sets whos turn it is and updates in db
        if($user->id == $game->playerTurn){
            if($game->player1ID == $user->id){
                $playerNum = 1;
                $game->playerTurn = $game->player2ID;
            }
            else if($game->player2ID == $user->id){
                $playerNum = 2;
                $game->playerTurn = $game->player1ID;
            }
            //checks to see if legal move
            if($board[0][$request->xcoord] == 0 && $playerNum != null){
                for($i=sizeof($board) -1; $i>-1; $i--){
                    if($board[$i][$request->xcoord] == 0){
                        $board[$i][$request->xcoord] =$playerNum;
                        $game->boardArray = json_encode($board);
                        //checks to see if a player has won
                        $checkWin = $this->checkWinner($board);
                        if($checkWin != false){
                            if($checkWin == 1){
                                $game->winner = $game->player1ID;
                            }
                            else if($checkWin == 2){
                                $game->winner = $game->player2ID;
                            }
                            $game->gameState = "ended";
                            $game->playerTurn = null;
                        } 
                        $game->save();
                        return response()->json([
                            'success'  => true,
                            'data' => $game
                        
                            ]);
                    }
                }
            }
        }
        return response()->json([
            'success'  => false,
            'data' => $game
            ]);
        

    }
                      /**
     * 
     *updates board
     * @param request object
     * 
     */
    public function updateBoard(Request $request){
        $this->validate( $request,[
            'board' => 'required',
            'game_id' => 'required'
        ]);
        $game = Game::where('id',"=",$request->game_id)->first();
    }
                      /**
     * 
     *Checks player turn
     * @param request object
     * @return game data true if its the current users turn else false
     */
    public function checkTurn(Request $request){
        $this->validate( $request,[
            'id' => 'required'
        ]);
        $user = Auth::user(); 
        $game = Game::where('id',"=",$request->id)->first();
        if($user->id == $game->playerTurn){
            return response()->json([
                'success'  => true,
                'data' => $game
            
                ]);
        }
        else {
            return response()->json([
                'success'  => false             
                ]);
        }
    }
                          /**
     * 
     *Checks the winner of the game -if there is a winner and the gamestate is either ended or forfeit
     * @param request object
     * @return game data
     */
    public function checkWinnerGame(Request $request) {
        $this->validate( $request,[
            'id' => 'required'
        ]);
        $user = Auth::user(); 
        $game = Game::where('id',"=",$request->id)->first();
        if($game->gameState == "ended" && $game->winner == $user->id){
            return response()->json([
                'success'  => true,
                'winner' => true             
                ]);
        }
        else if($game->gameState == "ended" && $game->winner != $user->id){
            return response()->json([
                'success'  => true,
                'winner' => false             
                ]);
        }
        else if($game->gameState == "forfeit" && $game->winner == $user->id){
            return response()->json([
                'success'  => false,
                'winner' => true           
                ]);
        }
        else if($game->gameState == "forfeit" && $game->winner != $user->id){
            return response()->json([
                'success'  => false,
                'winner' => false           
                ]);
        }
        else if($game->gameState != "ended"){
            return response()->json([
                'success'  => false,
                "data" => $game           
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
