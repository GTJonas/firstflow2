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
            'companyUuid' => $user->company_uuid,
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
        
        // Validate the request data
        $validatedData = $request->validate([
            'first_name' => 'nullable|string|max:255',
            'last_name' => 'nullable|string|max:255',
            'phone_number' => 'nullable|string|max:20',
            'bio' => 'nullable|string',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Adjust the allowed image types and maximum size as needed
        ]);

        // Update the user information
        $user->update($validatedData);

        $serverHost = $_SERVER['HTTP_HOST'];

        $storagePath = $serverHost;
        

        // Handle profile picture upload
        if ($request->hasFile('profile_picture')) {
            $profilePicture = $request->file('profile_picture');
            $imageName = $user->uuid . '.' . $profilePicture->getClientOriginalExtension();
            $imagePath = $profilePicture->storeAs('public/user-profiles', $imageName); // Store in the "public" disk under the "user-profiles" directory
            $user->update(['profile_picture' => $storagePath . '/storage/user-profiles/' . $imageName]);
        }

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
