@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
                <h2 class="header"><strong>Play Connect 4</strong></h2>        
                <div class="box">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif            
                </div>
                <div>
                    <form method="POST" class="chatSend">
                        <input type="text" id="messageBox" name="message" min="50" />
                        <input type="hidden" name="_token" value="{{ csrf_token() }}" />
                        <input type="submit" name="chat" value="send"/>
                        <input type="hidden" name= "gameid"value="{{$game->id}}" />
                    </form>
                </div>    
            </div>
        </div>
</div>

<script>var gameid="{{$game->id}}";</script>
<script src="{{ asset('js/game.js') }}" defer></script>
@endsection
