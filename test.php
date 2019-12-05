<?php


 $board = array(
    array("0","0","0","0","0","0","0"),
    array("0","0","0","0","0","0","0"),
    array("0","0","0","0","0","0","2"),
    array("0","0","0","0","0","0","2"),
    array("0","0","0","0","0","0","2"),
    array("0","0","0","0","0","0","2"),

    

  );
  printBoard($board);
  checkVertical($board);
  //northWest($board);
  //northEast($board);
  function checkDiag($board){

  }
  function northWest($board){
    for($x =sizeof($board[0])-1; $x>=0;$x--){ 
      for($y = sizeof($board) -1; $y>=0; $y--){
        if(isset($board[$y][$x]) && $board[$y][$x] == "1" && isset($board[$y-1][$x-1]) && $board[$y-1][$x-1] == "1" && isset($board[$y-2][$x-2]) && $board[$y-2][$x-2] == "1" && isset($board[$y-3][$x-3]) && $board[$y-3][$x-3] == "1" ){
          echo "connect 4!";
        }
      }
    }

  }
  function northEast($board){
    for($x =sizeof($board[0])-1; $x>=0;$x--){
      for($y = sizeof($board) -1; $y>=0; $y--){
        if(isset($board[$y][$x]) && $board[$y][$x] == "1" && isset($board[$y-1][$x+1]) && $board[$y-1][$x+1] == "1" && isset($board[$y-2][$x+2]) && $board[$y-2][$x+2] == "1" && isset($board[$y-3][$x+3]) && $board[$y-3][$x+3] == "1" ){
          echo "connect 4!";
        }
      }
    }

  }
  function printBoard($board){
    for($y =0; $y<sizeof($board);$y++){
        for($x =0; $x<sizeof($board[$y]);$x++){
            echo $board[$y][$x] . " ";
        }
        echo "<br/>";
    }
  }
  function checkHorizontal($board) {
    
    for($y = sizeof($board) -1; $y>=0; $y--){
      $counter =0;
      $counter2=0;
        for($x =sizeof($board[$y])-1; $x>=0;$x--){
            if(isset($board[$y][$x]) && $board[$y][$x] == "1"){
              $counter++;
            }
            if(isset($board[$y][$x]) && $board[$y][$x] == "2"){
              $counter2++;
            }
            if(!isset($board[$y][$x]) && $board[$y][$x] != "2" && $board[$y][$x] != "1"){
              $counter = 0;
            }

            if($counter == 4){
              echo "player 1  connect 4";
              break;
            }
            if($counter2 ==4){
              echo "connect4 for player 2";
            break;
            }
            // else {
            //   echo "no";
            // }
        }     
    }

  }

  function checkVertical($board) {
    for($x =sizeof($board[0])-1; $x>=0;$x--){
      $counter =0;
      $counter2 =0;
      for($y = sizeof($board) -1; $y>=0; $y--){
        if(isset($board[$y][$x]) && $board[$y][$x] == "1"){
          $counter++;
        }
        if(isset($board[$y][$x]) && $board[$y][$x] == "2"){
          $counter2++;
        }
        if(!isset($board[$y][$x]) && $board[$y][$x] != "2"){
          $counter2 = 0;
          
        }
        if(!isset($board[$y][$x]) && $board[$y][$x] != "1"){
          $counter = 0;
        }
        if($counter2 == 4) {
          echo "connect 4 for 2";
        break;
        }
        if($counter == 4){
          echo "connect 4! for 1";
          break;
        }   
      }
    }  
  }
  //create function to pass in x and y
  //use isset
?>