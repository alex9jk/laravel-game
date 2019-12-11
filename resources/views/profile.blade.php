@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
                <!-- <h2 class="header">Welcome <strong>{{$user->name}} </strong>to Connect 4 Lobby</h2>
       
            <div class="outer">
                <div class="box" id="box">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif
                  
                </div>   
            </div>  -->
            <h2 id="tableHead">Game Table</h2>
            
            <table id="profileTable" class="table table-striped table-bordered" style="width:100%">
                <thead>
                    <tr>
                        <th>Start Date</th>
                        <th>Player 1 ID</th>
                        <th>Player 2 ID</th>
                        <th>Status</th>
                        <th>Winner</th>

                    </tr>
                </thead>
                <tbody>
                    @foreach($games as $game)
                    <tr>
                        <td>{{$game->created_at}}</td>
                      <td>{{$game->player1ID}}</td>
                      <td>{{$game->player2ID}}</td>
                      <td>{{$game->gameState}}</td>
                      <td>{{$game->winner}}</td>
                    </tr>
                    @endforeach
                </tbody>


            </table>
            <a href="home" class="btn btn-primary">Proceed to Game Lobby</a>
            </div>
        </div>
</div>

@endsection
