public function allPosts()
{

// Hämta alla inlägg från databasen och returnera dem som JSONa
$posts = Post::with('user')->get()->sortByDesc('created_at')->unique();

$rolesData = [];

foreach ($posts as $post) {
$roleID = $post->user->role_id;
if (!isset($rolesData[$roleID])) {
$rolesData[$roleID] = [];
}

$teacherId = $post->schoolClass ? $post->schoolClass->teacher_id : null;

$postsData[$roleID][] = [
'uuid' => $post->uuid,
'firstName' => $post->user->first_name,
'lastName' => $post->user->last_name,
'profilePicture' => $post->user->profile_picture,
'content' => $post->content,
'image' => $post->image,
'created_at' => $post->created_at,
'classId' => $post->user->class_id,
];

}

return response()->json([
'roleId' => $postsData,
]);

}

public function ownPosts()
{
try {
// Get the authenticated user
$user = JWTAuth::parseToken()->authenticate();

// Hämta användarens egna inlägg från databasen och returnera dem som JSON
$posts = Post::with('user')->where('user_uuid', $user->uuid)->orderByDesc('created_at')->get();

// Convert the "profile_picture" key to "profilePicture" in each post
$updatedPosts = $posts->map(function ($post) {
$post->user->profilePicture = $post->user->profile_picture;
unset($post->user->profile_picture);
return $post;
});

return response()->json($updatedPosts);

} catch (JWTException $e) {
// Something went wrong with JWT token
return response()->json(['error' => 'Failed to authenticate.'], 401);
}
}

public function store(Request $request)
{
try {
// Get the authenticated user
$user = JWTAuth::parseToken()->authenticate();

// Validate the incoming request data
$validator = Validator::make($request->all(), [
'content' => 'required|string|max:255',
'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048', // Image validation rules
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

public function studentsInClassPost($classId)
{
$users = User::where('class_id', $classId)
->with(['posts', 'schoolClass'])
->get();

$postsData = [];

foreach ($users as $user) {
foreach ($user->posts as $post) {
$teacherId = $user->schoolClass ? $user->schoolClass->teacher_id : null;

$postsData[] = [
'uuid' => $post->uuid,
'firstName' => $user->first_name,
'lastName' => $user->last_name,
'profilePicture' => $user->profile_picture,
'content' => $post->content,
'image' => $post->image,
'created_at' => $post->created_at,
'classId' => $user->class_id,
'teacherId' => $teacherId,
'companyId' => null,
];
}
}

return response()->json([
'posts' => $postsData,
]);
}
