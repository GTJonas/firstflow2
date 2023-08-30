<?php

namespace App\Http\Controllers;
use App\Models\Post;
use App\Models\SchoolClass;
use App\Models\User;
use App\Models\Company;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use JWTAuth;
use Tymon\JWTAuth\Exceptions\JWTException;

class SchoolClassController extends Controller
{
    public function createClass(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $className = $request->input('class_name');

            $class = new SchoolClass();
            $class->name = $className;
            $class->school_id = $user->school_id;
            $class->teacher_id = $user->uuid;
            $class->save();

            return response()->json(['message' => 'Klassen skapades.'], 200);
        } catch (JWTException $e) {
            // Something went wrong with JWT token
            return response()->json(['error' => 'Failed to authenticate.'], 401);
        }
    }

    public function showOwnClass(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            $roleId = $user->role_id;
            $companyUuid = $user->company_uuid;

            $classesData = []; // Initialize an array to store classes data
            $uniqueTeachers = []; // Initialize an array to store unique teacher objects

            if ($roleId === 2) {
                $usersWithSameCompany = User::where('company_uuid', $companyUuid)->get();

                $teacherIds = []; // Initialize an array to store unique teacher IDs

                foreach ($usersWithSameCompany as $userWithCompany) {
                    $classId = $userWithCompany->class_id;

                    if ($classId) {
                        if (!isset($classesData[$classId])) {
                            $class = SchoolClass::with('teacher')->find($classId);
                            if ($class) {
                                $teacher = $class->teacher; // Get the associated teacher

                                // Add the teacher to the uniqueTeachers array if not already present
                                if (!in_array($teacher->uuid, $teacherIds)) {
                                    $teacherIds[] = $teacher->uuid;
                                    $uniqueTeachers[] = [
                                        'uuid' => $teacher->uuid,
                                        'first_name' => $teacher->first_name,
                                        'last_name' => $teacher->last_name,
                                        'email' => $teacher->email,
                                        '' => $teacher->email,
                                        'profile_picture' => $teacher->profile_picture,
                                        // Add other teacher properties as needed
                                    ];
                                }

                                $classesData[$classId] = [
                                    'classname' => $class->name,
                                    'classid' => $classId,
                                    'teacher' => [
                                        'uuid' => $teacher->uuid,
                                        'first_name' => $teacher->first_name,
                                        'last_name' => $teacher->last_name,
                                        'email' => $teacher->email,
                                        'profile_picture' => $teacher->profile_picture,
                                        'classname' => $class->name,
                                        // Add other teacher properties as needed
                                    ],
                                    'students' => [],
                                ];
                            }
                        }

                        $classesData[$classId]['students'][] = [
                            'uuid' => $userWithCompany->uuid,
                            'first_name' => $userWithCompany->first_name,
                            'last_name' => $userWithCompany->last_name,
                            'email' => $userWithCompany->email,
                            'class_id' => $userWithCompany->class_id,
                            'profile_picture' => $userWithCompany->profile_picture,
                            'classname' =>  $userWithCompany->schoolClass->name,

                            // Add other student properties as needed
                        ];
                    }
                }
            } elseif ($roleId === 3) {
                $teacherClasses = SchoolClass::where('teacher_id', $user->uuid)
                    ->with('teacher', 'students')
                    ->get();

                foreach ($teacherClasses as $class) {
                    $classId = $class->id;

                    $classesData[$classId] = [
                        'classname' => $class->name,
                        'classid' => $classId,
                        'teacher' => [
                            'uuid' => $class->teacher->uuid,
                            'first_name' => $class->teacher->first_name,
                            'last_name' => $class->teacher->last_name,
                            'email' => $class->teacher->email,
                            'school_id' => $class->teacher->school_id,
                            'profile_picture' => $class->teacher->profile_picture,
                            // Add other teacher properties as needed
                        ],
                        'students' => [],
                    ];

                    foreach ($class->students as $student) {
                        $classesData[$classId]['students'][] = [
                            'uuid' => $student->uuid,
                            'first_name' => $student->first_name,
                            'last_name' => $student->last_name,
                            'email' => $student->email,
                            'profile_picture' => $student->profile_picture,
                            // Add other student properties as needed
                        ];
                    }
                }
            } elseif ($roleId === 4) {
                $studentClass = SchoolClass::with('teacher', 'students')
                    ->where('id', $user->class_id)
                    ->first();

                if (!$studentClass) {
                    return response()->json(['message' => 'Class not found for the user.'], 404);
                }

                $classId = $studentClass->id;

                $classesData[$classId] = [
                    'classname' => $studentClass->name,
                    'classid' => $classId,
                    'teacher' => [
                        'uuid' => $studentClass->teacher->uuid,
                        'first_name' => $studentClass->teacher->first_name,
                        'last_name' => $studentClass->teacher->last_name,
                        'email' => $studentClass->teacher->email,
                        'profile_picture' => $studentClass->teacher->profile_picture,

                        // Add other teacher properties as needed
                    ],
                    'students' => [],
                ];

                foreach ($studentClass->students as $student) {
                    $classesData[$classId]['students'][] = [
                        'uuid' => $student->uuid,
                        'first_name' => $student->first_name,
                        'last_name' => $student->last_name,
                        'email' => $student->email,
                        'profile_picture' => $student->profile_picture,
                        // Add other student properties as needed
                    ];
                }
            } else {
                return response()->json(['message' => 'User does not have the required role.'], 403);
            }

            return response()->json([
                'classes' => array_values($classesData), // Convert associative array to indexed array
                'unique_teachers' => $uniqueTeachers
            ]);
        } catch (JWTException $e) {
            // Something went wrong with JWT token
            return response()->json(['error' => 'Failed to authenticate.'], 401);
        }
    }




    public function showClassFromSchool(Request $request)
    {
        $classes = SchoolClass::with('school', 'students', 'teacher')->get()->sortByDesc('created_at')->unique();

        $rolesData = [];

        foreach ($classes as $class) {
            $schoolID = $class->school->name;
            if (!isset($classData[$schoolID])) {
                $classData[$schoolID] = [];
            }

            $students = $class->students->map(function ($student) {
                return [
                    'firstName' => $student->first_name,
                    'lastName' => $student->last_name,
                ];
            });

            $classData[$schoolID][] = [
                'class' => $class->name,
                'teacher' => [
                    'firstName' => $class->teacher->first_name,
                    'lastName' => $class->teacher->last_name,
                ],
                'students' => $students,
            ];

        }

        return response()->json([
            'schoolId' => $classData,
        ]);
    }

    public function getAllStudentsFromSchool($schoolId)
    {
        try {
            $students = User::with('school')
                ->where('school_id', $schoolId)
                ->get();

            return response()->json($students);
        } catch (Exception $e) {
            return response()->json(['error' => 'Failed to fetch students.'], 500);
        }
    }

    public function assignStudentsToClass(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            // Validate input
            $validator = Validator::make($request->all(), [
                'student_ids' => 'required|array',
                'class_id' => 'required|exists:school_classes,id',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $studentIds = $request->input('student_ids');
            $classId = $request->input('class_id');

            $class = SchoolClass::where('teacher_id', $user->uuid)
                ->where('id', $classId)
                ->first();

            if (!$class) {
                return response()->json(['message' => 'Class not found for the teacher.'], 404);
            }

            // Update students' class_id in a more efficient way
            User::whereIn('uuid', $studentIds)
                ->update(['class_id' => $class->id]);

            // Fetch updated student data
            $updatedStudents = User::whereIn('uuid', $studentIds)->get();

            // Call the method to update the posts' class_id
            $this->updatePostsClassId($studentIds, $class->id);

            return response()->json([
                'message' => 'Students assigned to class successfully.',
                'students' => $updatedStudents, // Include updated student data
            ], 200);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Failed to authenticate.'], 401);
        }
    }

    public function updatePostsClassId($studentIds, $classId)
    {
        // Update the class_id field for posts of the specified students
        Post::whereIn('user_uuid', $studentIds)
            ->update(['class_id' => $classId]);
    }

    public function detachStudentsFromClass(Request $request)
    {
        try {
            $user = JWTAuth::parseToken()->authenticate();

            // Validate input
            $validator = Validator::make($request->all(), [
                'student_ids' => 'required|array',
                'class_id' => 'required|exists:school_classes,id',
            ]);

            if ($validator->fails()) {
                return response()->json(['error' => $validator->errors()], 400);
            }

            $studentIds = $request->input('student_ids');
            $classId = $request->input('class_id');

            // Find the class
            $class = SchoolClass::where('teacher_id', $user->uuid)
                ->where('id', $classId)
                ->first();

            if (!$class) {
                return response()->json(['message' => 'Class not found for the teacher.'], 404);
            }

            // Detach students from the class
            User::whereIn('uuid', $studentIds)->update(['class_id' => null]);

            // Fetch updated student data
            $updatedStudents = User::whereIn('uuid', $studentIds)->get();

            // Optionally, update the class_id for associated posts as well
            $this->updatePostsClassId($studentIds, null);

            return response()->json([
                'message' => 'Students detached from class successfully.',
                'students' => $updatedStudents, // Include updated student data
            ], 200);
        } catch (JWTException $e) {
            return response()->json(['error' => 'Failed to authenticate.'], 401);
        }
    }

    public function ChangeCompanyforUser(Request $request) {
        try {
            $userId = $request->input('user_id');
            $newCompanyUuid = $request->input('new_company_uuid');

            \Log::info('Attempting to change company for user: ' . $userId);

            // Assuming you're using Eloquent models and assuming User and Company models
            $user = User::find($userId);

            if (!$user) {
                \Log::error('User not found for ID: ' . $userId);
                return response()->json(['error' => 'User not found'], 404);
            }

            \Log::info('User found: ' . $user);

            $newCompany = Company::where('uuid', $newCompanyUuid)->first();

            if (!$newCompany) {
                \Log::error('Company not found for UUID: ' . $newCompanyUuid);
                return response()->json(['error' => 'Company not found'], 404);
            }

            // Update the user's company_uuid to the new one
            $user->company_uuid = $newCompany->uuid;
            $user->save();

            return response()->json([
                'message' => 'Company changed successfully',
                'user_Id' => $userId,
                'company_Id' => $newCompanyUuid
            ]);
        } catch (\Exception $e) {
            // Log the exception for debugging
            \Log::error($e->getMessage());
            return response()->json(['error' => 'An error occurred'], 500);
        }
    }

}
