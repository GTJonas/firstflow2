<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class TokenController extends Controller
{
    /**
     * Check the validity of a JWT token and refresh it if it's valid.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function checkToken(Request $request)
    {
        $token = $request->input('token');

        try {
            // Check if the token is valid
            $isValid = JWTAuth::check($token);

            // Refresh a valid token
            $newToken = JWTAuth::refresh($token);

            return response()->json(['is_valid' => $isValid, 'new_token' => $newToken]);
        } catch (JWTException $e) {
            // Something went wrong with JWT token
            return response()->json(['error' => 'Failed to validate the token.'], 401);
        }
    }
}
