<?php

namespace App\Http\Controllers;

use App\Models\SchoolClass;
use App\Models\User;
use App\Models\Company;

use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Str;
use Intervention\Image\Facades\Image;
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
                'image' => 'image|mimes:jpeg,png,jpg,gif|max:2048|nullable',
                'from' => 'required|date_format:H:i|nullable',
                'to' => 'required|date_format:H:i|nullable',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 400);
            }

            // Create a new post
            $post = new Post();
            if ($user->class_id && $user->company_uuid) {
                $post->uuid = Str::uuid()->toString();

                // Process the uploaded image and use the post UUID as the file name
                $imagePath = null;
                if ($request->hasFile('image')) {
                    $image = $request->file('image');
                    $imageName = $post->uuid . '.' . 'png';
                    $imagePath = $image->storeAs('post_images', $imageName, 'public');

                    // Resize the uploaded image to a fixed width while maintaining aspect ratio
                    /*$resizedImage = Image::make(public_path('storage/' . $imagePath))
                        ->resize(1440, null, function ($constraint) {
                            $constraint->aspectRatio();
                        })
                        ->save(public_path('storage/' . $imagePath)); // Save the resized image*/
                }

                $url = 'http://192.168.1.78:8000/storage/';

                $post->content = $request->input('content');
                $post->user_uuid = $user->uuid;
                $post->image = $url . $imagePath;

                $post->class_id = $user->class_id;
                $post->company_id = $user->company_uuid;

                $post->from = $request->input('from');
                $post->to = $request->input('to');

                $post->save();

                return response()->json($post, 201);
            } else {
                return response()->json(['error' => 'You are not in a class or company.'], 400);
            }
        } catch (JWTException $e) {
            return response()->json(['error' => 'Failed to authenticate.'], 401);
        }
    }

    public function getClasses()
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            // Need A If role_id === 2 for supervisors to see its classes




            if ($user->role_id === 3) {
                $teacherClasses = SchoolClass::where('teacher_id', $user->uuid)->with('students')->get(['id', 'name']);

                $formattedClasses = [];
                foreach ($teacherClasses as $class) {
                    $formattedClass = [
                        'id' => $class->id,
                        'name' => $class->name,
                    ];
                    $formattedClasses[] = $formattedClass;
                }

                return response()->json(['teacherClasses' => $formattedClasses]);
            } else {
                return response()->json(['teacherClasses' => "Null"]);;
            }

        } catch (JWTException $e) {
            return response()->json(['error' => 'Failed to authenticate.'], 401);
        }
    }

    public function getUsersForClass(Request $request)
    {
        try {
            // Get the authenticated user
            $user = JWTAuth::parseToken()->authenticate();

            // Check if the authenticated user is a teacher or admin
            if ($user->role_id !== 3 && $user->role_id !== 1) {
                return response()->json(['error' => 'Unauthorized.'], 401);
            }

            // Retrieve the selected class ID from the query parameter
            $classId = $request->input('classId');

            // Fetch users who belong to the specified class
            $users = User::where('class_id', $classId)->get(['id', 'name']);

            return response()->json(['userOptions' => $users]);

        } catch (JWTException $e) {
            // Something went wrong with JWT token
            return response()->json(['error' => 'Failed to authenticate.'], 401);
        }
    }

    public function acceptPost($postId)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $post = Post::findOrFail($postId);
            $post->update(['status' => 'approved', 'handled_by' => $user->uuid]);

            return response()->json(['message' => 'Post accepted']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to accept post'], 500);
        }
    }

    // Controller method to decline a post
    public function declinePost($postId)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $post = Post::findOrFail($postId);
            $post->status = 'rejected';
            $post->update(['status' => 'rejected', 'handled_by' => $user->uuid]);

            return response()->json(['message' => 'Post declined']);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to decline post'], 500);
        }
    }

// not used?
/*    public function getTeacherCompanyPosts(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            if ($user->role_id === 3) {
                $validator = Validator::make($request->all(), [
                    'company_uuid' => 'required|exists:companies,uuid',
                ]);

                if ($validator->fails()) {
                    return response()->json(['error' => $validator->errors()], 400);
                }

                $companyPosts = Post::whereHas('class', function ($query) use ($user, $request) {
                    $query->where('teacher_id', $user->uuid)
                        ->whereHas('company', function ($companyQuery) use ($request) {
                            $companyQuery->where('uuid', $request->input('company_uuid'));
                        });
                })->get();

                return response()->json(['companyPosts' => $companyPosts]);
            }

            return response()->json(['error' => 'User is not a teacher.'], 400);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Failed to authenticate.'], 401);
        }
    }
*/
    public function getFilteredPosts(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();
            $role = $user->role_id;

            $filteredPosts = Post::query()->with('user');

            switch ($role) {
                case 1: //Admin
                    $filteredPosts = Post::with('user');
                        // we may need to add School filter
                        // Class filter
                        // User Filter
                        // And company filter
                        // Obviously should be allowed to change status and later down
                        // the road should be able to control classes
                    break;
                case 2: // Supervisor
                    // Retrieve the company UUID based on the supervisor's UUID
                    $companyUuid = Company::with('supervisors')
                        ->where('uuid', $user->company_uuid) // Change this to 'uuid'
                        ->first();


                    // Now you can use $companyUuid to filter the posts
                    $filteredPosts->where('company_id', $companyUuid->uuid); // Change this to 'company_uuid'

                    break;

                case 3: //Teacher

                    if ($request->has('class_id')) {
                        $selectedClassId = $request->input('class_id');
                        if ($selectedClassId) {
                            $filteredPosts->where('class_id', $selectedClassId);
                        }
                    }
                    if ($request->has('user_uuid')) {
                        $selectedUserId = $request->input('user_uuid');
                        if ($selectedUserId) {
                            $filteredPosts->where('user_uuid', $selectedUserId);
                        }
                    }
                        // Potential of having Change of status
                    break;
                case 4: //Student
                    $filteredPosts->where('user_uuid', $user->uuid);
                    // Unsure of what filters are needed. Probably will have to change the date
                    // filter to eventually include weeks instead of days
                    break;
            }

            if ($request->has('weeks')) {
                $weeks = $request->input('weeks');
                $filteredPosts->whereDate('created_at', '>=', now()->subWeeks($weeks));
            }

            // ... Global Filter methods


            $perPage = $request->input('per_page', 5); // Default per page is 5
            $paginatedPosts = $filteredPosts->orderByDesc('created_at')->paginate($perPage);


            $transformedPosts = $paginatedPosts->getCollection()->map(function ($post) use ($user, $role) {
                // Transform the post as needed
                return $post;
            });

            return response()->json([
                'filteredPosts' => $transformedPosts,
                'pagination' => [
                    'current_page' => $paginatedPosts->currentPage(),
                    'last_page' => $paginatedPosts->lastPage(),
                    'per_page' => $paginatedPosts->perPage(),
                    'total' => $paginatedPosts->total(),
                ],
            ]);

        } catch (JWTException $e) {
            return response()->json(['error' => 'Failed to authenticate.'], 401);
        }
    }
}
