<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class PostController extends Controller
{

    public function store(Request $request)
    {
        try {
            // Get the authenticated user
            $user = JWTAuth::parseToken()->authenticate();

            // Validate the incoming request data
            $validator = Validator::make($request->all(), [
                'content' => 'required|string|max:255',
                'image' => 'image|mimes:jpeg,png,jpg,gif|max:2048|nullable', // Image validation rules
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 400);
            }

            $post = new Post();
            $post->uuid = Str::uuid()->toString();

            $storagePath = 'http://192.168.1.78:8000/storage/';

            // Process the uploaded image and use the post UUID as the file name
            $imagePath = null;
            if ($request->hasFile('image')) {
                $image = $request->file('image');
                $imageName = $post->uuid . '.' . 'png';
                $imagePath = $image->storeAs('post_images', $imageName, 'public'); // Store the image in the 'public/post_images' directory
            }

            // Create a new post
            $post->content = $request->input('content');
            $post->user_uuid = $user->uuid;
            $post->image = $storagePath . $imagePath; // Save the image path in the 'image' field of the 'Post' model
            $post->save();

            // Return the newly created post as JSON
            return response()->json($post, 201);

        } catch (JWTException $e) {
            // Something went wrong with JWT token
            return response()->json(['error' => 'Failed to authenticate.'], 401);
        } catch (\Exception $e) {
            // Something went wrong with the database or validation
            return response()->json(['error' => 'Failed to create post.'], 500);
        }
    }

    public function applyClassAndSchoolFilters($query, $validatedData)
    {
        if (isset($validatedData['classId'])) {
            $query->where('class_id', $validatedData['classId']);
        }

        if (isset($validatedData['schoolId'])) {
            $query->whereHas('schoolClass', function ($subQuery) use ($validatedData) {
                $subQuery->where('school_id', $validatedData['schoolId']);
            });
        }

        // Add more filters as needed...

        return $query;
    }

    public function applyUuidFilter($query, $validatedData)
    {
        if (isset($validatedData['uuid'])) {
            $query->where('uuid', $validatedData['uuid']);
        }

        return $query;
    }

    public function getFilteredPosts(Request $request)
    {

        try {

            $user = JWTAuth::parseToken()->authenticate();


            // Validation of input parameters
            $validatedData = $request->validate([
                'roleId' => 'nullable|exists:roles,id',
                'classId' => 'nullable|exists:school_classes,id',
                'schoolId' => 'nullable|exists:schools,id',
                'uuid' => 'nullable|uuid',
                'showAllPosts' => 'nullable|boolean',
            ]);

            // Mapping of roles to conditions
            $roleConditions = [
                'admin' => [],
                'teacher' => array_key_exists('roleId', $validatedData) ? ['role_id' => $validatedData['roleId']] : [],
                'student' => ['role_id', '<>', 1], // Assuming role_id for 'admin' is 1
                'default' => [''], // Default condition (can be empty or have a specific condition)
            ];

            $query = Post::with(['user', 'schoolClass']) // Load user and schoolClass relationships
            ->orderByDesc('created_at');



            if (array_key_exists($user->role->name, $roleConditions)) {
                $query->whereHas('user', function ($query) use ($roleConditions, $user) {
                    $condition = $roleConditions[$user->role->name];
                    $query->where($condition);
                });
            }


            $this->applyClassAndSchoolFilters($query, $validatedData);
            $this->applyUuidFilter($query, $validatedData);

            $showAllPosts = $validatedData['showAllPosts'] ?? false;

            if ($showAllPosts && $user->role->name === 'teacher') {
                $this->applyClassFilter($query, $user->schoolClass->id);
            } else {
                $this->applyUserFilter($query, $user);
            }

            $posts = $query->get();

            return response()->json($roleConditions);

        } catch (JWTException $e) {
            return response()->json(['error' => 'Database error occurred.'], 401);
        }
    }

    // Existing filter methods ...

    private function applyUserFilter($query, $user)
    {
        $query->where('user_uuid', $user->uuid);
    }

    private function applyClassFilter($query, $classId)
    {
        $query->where('class_id', $classId);
    }

    // Rest of your filter methods ...

}
