<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class ProtectedController extends Controller
{

    /**
     * Get protected data.
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function index(Request $request)
    {
        try {
            // Get the authenticated user
            $user = JWTAuth::parseToken()->authenticate();

            // Access user data if needed
            $userData = [
                'uuid' => $user->uuid,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'roleId' => $user->role_id,
                'profilePicture' => $user->profile_picture,
                'schoolId' => $user->school_id,
                'classId' => $user->class_id,
                // Add more user data fields as needed
            ];

            // Return the protected data as JSON response
            return response()->json([
                'message' => 'You have successfully accessed protected data!',
                'user' => $userData,
            ]);
        } catch (JWTException $e) {
            // Something went wrong with JWT token
            return response()->json(['error' => 'Failed to authenticate.'], 401);
        }
    }
}
