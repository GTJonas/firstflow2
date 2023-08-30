<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use JWTAuth;
use Illuminate\Support\Facades\Auth;

class AuthController extends Controller
{
    public function login(Request $request)
    {
        $request->validate([
            'email' => 'required|email',
            'password' => 'required',
        ]);

        // Authenticate the user using Laravel's built-in authentication features
        $credentials = $request->only('email', 'password');
        $remember = $request->has('remember'); // Check if 'remember' is present in the request
        if (Auth::attempt($credentials, $remember)) {
            // Authentication successful
            $user = Auth::user();

            // Generate a JWT token
            $token = JWTAuth::fromUser($user);

            return response()->json(compact('token'));
        }

        // Authentication failed
        return response()->json(['error' => 'Invalid credentials'], 401);
    }
}
