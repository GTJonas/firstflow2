<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Tymon\JWTAuth\Exceptions\JWTException;
use JWTAuth;

class UsersController extends Controller
{

    public function getUserByUuid($uuid)
    {
        $user = User::where('uuid', $uuid)->first();

        if (!$user) {
            return response()->json(['error' => 'User not found'], 404);
        }

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

        return response()->json([
            'user' => $userData,
        ]);
    }

    public function UserSortedbyRoles() {

        $users = User::orderBy('role_id')->get();

        $rolesData = [];

        foreach ($users as $user) {
            $roleID = $user->role_id;
            if (!isset($rolesData[$roleID])) {
                $rolesData[$roleID] = [];
            }

            $rolesData[$roleID][] = [
                'uuId' => $user->uuid,
                'firstName' => $user->first_name,
                'lastName' => $user->last_name,
                'email' => $user->email,
                'roleId' => $user->role_id,
                'profilePicture' => $user->profile_picture,
                'phoneNumber' => $user->phone_number,
                'bio' => $user->bio,
            ];

        }

        return response()->json([
            'roleId' => $rolesData,
        ]);
    }

    public function updateUserProfile(Request $request)
    {
        try {
            // Get the authenticated user
            $user = JWTAuth::parseToken()->authenticate();
            // Validate the request data (same as before)

            // Update the user information
            $user->update([
                'first_name' => $request->input('first_name'),
                'last_name' => $request->input('last_name'),
                'phone_number' => $request->input('phone_number'),
                'bio' => $request->input('bio'),
            ]);

            $storagePath = 'http://192.168.1.78:8000/storage/';

            $imagePath = null;
            if ($request->hasFile('profile_picture')) {
                $profilePicture = $request->file('profile_picture');
                $imageName = $user->uuid . '.' . 'png';
                $imagePath = $profilePicture->storeAs('user-profiles', $imageName, 'public');
                $user->update(['profile_picture' => $storagePath . $imagePath]);
            }

            $user->save();

            // Return the updated user data along with the success message
            $userData = [
                'uuid' => $user->uuid,
                'first_name' => $user->first_name,
                'last_name' => $user->last_name,
                'email' => $user->email,
                'roleId' => $user->role_id,
                'profilePicture' => $user->profile_picture,
                // Add more user data fields as needed
            ];

            // Return a JSON response with the updated user data and success message
            return response()->json([
                'message' => 'Profile updated successfully',
                'user' => $userData,
            ]);

        } catch (JWTException $e) {
            // Something went wrong with JWT token
            return response()->json(['error' => 'Failed to authenticate.'], 401);
        } catch (\Exception $e) {
            // Log the caught exception for debugging purposes
            \Log::error($e);

            // Something went wrong with the database or validation
            return response()->json(['error' => 'Failed to update user profile.'], 500);
        }
    }



}