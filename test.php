<?php


 $board = array(
    array("O","O","O","O","O","O","O"),
    array("O","O","O","O","O","O","O"),
    array("O","O","O","O","O","O","O"),
    array("O","O","O","O","O","O","O"),
    array("O","O","O","O","O","O","O"),
    array("O","O","O","O","O","O","O"),

    

  );
  checkWin($board);
  function printBoard($board){
    for($y =0; $y<sizeof($board);$y++){
        for($x =0; $x<sizeof($board[$y]);$x++){
            echo $board[$y][$x] . " ";
        }
        echo "<br/>";
    }
  }
  function checkWin($board) {
    for($y = sizeof($board) -1; $y>=0; $y--){
        for($x =sizeof($board[$y])-1; $x>=0;$x--){
            echo $board[$y][$x] . " ";
        }
        echo "<br/>";
    }
  }
?>