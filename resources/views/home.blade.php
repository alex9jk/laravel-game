@extends('layouts.app')

@section('content')
<div class="container">
    <div class="row justify-content-center">
        <div class="col-md-8">
            <div class="card">
                <div class="card-header">Dashboard</div>

                <div class="card-body">
                    @if (session('status'))
                        <div class="alert alert-success" role="alert">
                            {{ session('status') }}
                        </div>
                    @endif

                    You are logged in! Welcome, {{$user->name}}
                    <div>
                    @foreach ($messages as $message)
                        <div> {{ $message->messageText }}</div>
                    @endforeach
                    </div>
                    <div>
                        <form method="POST">
                            <input type="text" name="message" />
                            <input type="hidden" name="_token" value="{{ csrf_token() }}" />
                            <input type="submit" name="submit"/>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    </div>
</div>
@endsection
