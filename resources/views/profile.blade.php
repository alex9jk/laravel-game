@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
                <h2 class="header">Welcome <strong>{{$user->name}} </strong>to Connect 4 Lobby</h2>
       
            <!-- <div class="outer">
                <div class="box" id="box">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif
                  
                </div>   
            </div> -->
            
            <table style="width:100%">
                <tr>
                  <th>player1ID</th>
                  <th>player2ID</th>
                  <th>status</th>
                </tr>
                @foreach($games as $game)
                <tr>
                  <td>{{$game->player1ID}}</td>
                  <td>{{$game->player2ID}}</td>
                  <td>{{$game->gameState}}</td>
                </tr>
                @endforeach
            </table>
            </div>
        </div>
</div>

@endsection
