@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
                <h2 class="header">Welcome <strong>{{$user->name}} </strong>to Connect 4 Lobby</h2>
                <a class="btn btn-primary" id = "btn"href={{route('game.playgame')}}>Play game</a>
                <div class="box" id="box">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif
                  
                </div>  
                <div>
                            <form method="POST" class="chatSend">
                                <input type="text" name="message" min="50" id="messageInput"/>
                                <input type="hidden" name="_token" value="{{ csrf_token() }}" />
                                <input type="submit" name="chat" value="send"class="submit"/>
                            </form>
                        </div>
                <div id="waiting-users"></div>  
            </div>
        </div>
</div>

<script src="{{ asset('js/lobby.js') }}" defer></script>
@endsection
