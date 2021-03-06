@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row ">
        <div class="col-md-8">
                <h2 class="header"><strong>Play Connect Four</strong></h2>
                <div><h5 id="whosTurn"></h5></div>
        <div id= "wrapper">    
            <div>    
                <div class="box">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif            
                </div>
                <div id ="stretch">
                    <form method="POST" class="chatSend">
                        <input type="text" id="messageBox" name="message" min="50" class="form-control" />
                        <input type="hidden" name="_token" value="{{ csrf_token() }}" />
                        <input type="submit" name="chat" value="send" class="submit btn btn-primary"/>
                        <input type="hidden" name= "gameid"value="{{$game->id}}" />
                    </form>
                </div>
            </div>
                
                <div class= "boardContainer">
                    <svg xmlns="http://www.w3.org/2000/svg" version="1.1" width="560px" height="560px" class="svgClass" >
                    @for($i=0; $i < 7;$i++)
                        <rect x="{{((80 * $i))}} " y="0" width="80px" height="80px" fill="transparent" stroke-width="2px" stroke="black" />
                    @endfor
                        <g id="group" width="560px" x="0" y="0">
                        </g>
                    
                    @for ($i = 0; $i < 7; $i++)
                        @for ($j = 1; $j < 7; $j++)
                            <rect x="{{(0 + (80 * $i))}} " y="{{(0 + (80 * $j))}}" width="80px" height="80px" fill="navy" stroke-width="2px" stroke="black" id="{{'target' . $i .($j -1)}}"/>
                            <circle cx="{{(40 + (80 * $i))}} " cy="{{(40 + (80 * $j))}}" r="25" fill="white" />
                        @endfor
                    @endfor
                    </svg>
                </div> 
                
            </div>   
        </div>
    </div>
</div>

<script>var gameid="{{$game->id}}";</script>
<script src="{{ asset('js/game.js') }}" defer></script>
@endsection
