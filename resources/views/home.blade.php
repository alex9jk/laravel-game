@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
                <h2 class="header">Welcome <strong>{{$user->name}} </strong>to Connect Four Lobby</h2>
        <div id="flex">
            <div class="outer">
                <div class="box" id="box">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif
                  
                </div>  
                <div id="form-div">
                            <form method="POST" class="chatSend">
                                <input type="text" name="message" class="form-control" min="50" id="messageInput"/>
                                <input type="hidden" name="_token" value="{{ csrf_token() }}" />
                                <input type="submit" name="chat" value="send"class="submit btn btn-primary"/>
                            </form>
                        </div>
                </div>
                <div>
                    <h5>Available Users to Play</h5>
                    <div id="waiting-users"></div>
                </div>
                
            </div>
            
            </div>

        </div>
</div>

<script src="{{ asset('js/lobby.js') }}" defer></script>
@endsection
