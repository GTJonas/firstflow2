<?php

namespace App\Http\Controllers;

use App\Models\Company;
use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Tymon\JWTAuth\Exceptions\JWTException;
use JWTAuth;

class CompanyController extends Controller
{
    public function store(Request $request)
    {
        try {
            // Get the authenticated user
            $supervisor = JWTAuth::parseToken()->authenticate();

            // Check if the supervisor already has a company profile
            if ($supervisor->company_uuid) {
                return response()->json(['error' => 'Supervisor already has a company profile.'], 400);
            }

            $validatedData = $request->validate([
                'name' => 'required|unique:companies|max:255',
            ]);

            $company = new Company();
            $company->uuid = Str::uuid()->toString(); // Generate a UUID
            $company->name = $validatedData['name'];

            $company->save();

            // Assign the company UUID to the supervisor
            $supervisor->company_uuid = $company->uuid;
            $supervisor->save();

            return response()->json(['message' => 'Företagsprofilen skapades.', 'uuid' => $company->uuid], 200);
        } catch (JWTException $e) {
            // Something went wrong with JWT token
            return response()->json(['error' => 'Failed to authenticate.'], 401);
        } catch (\Exception $e) {
            // Something went wrong with the database or validation
            return response()->json(['error' => 'Failed to create company profile.'], 500);
        }
    }


    public function editCompanyProfile(Request $request, $uuid)
    {


        // Find the company by UUID
        $company = Company::where('uuid', $uuid)->first();

        if (!$company) {
            return response()->json(['error' => 'Company not found.'], 404);
        }

        // Validate the incoming data
        $validatedData = $request->validate([
            'name' => 'required|string|max:255',
            'profile_picture' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Adjust file types and size
            'banner' => 'nullable|image|mimes:jpeg,png,jpg,gif|max:2048', // Adjust file types and size
            'category' => 'nullable|string|max:255',
            'location' => 'nullable|string|max:255',
            'about' => 'nullable|string|max:255',
        ]);

        $url = 'http://192.168.1.78:8000/storage/';

        // Handle image uploads for profile_picture and banner
        $profilePicturePath = null;
        if ($request->hasFile('profile_picture')) {
            $profilePicture = $request->file('profile_picture');
            $profilePictureName = $uuid . '.' . 'png';
            $profilePicturePath = $profilePicture->storeAs('company/profile_picture', $profilePictureName, 'public');
            $validatedData['profile_picture'] = $url . $profilePicturePath;
        }

        $bannerPath = null;
        if ($request->hasFile('banner')) {
            $banner = $request->file('banner');
            $bannerName = $uuid . '.' . 'png';
            $bannerPath = $banner->storeAs('company/banner', $bannerName, 'public');
            $validatedData['banner'] = $url . $bannerPath;
        }

        $company->update($validatedData);

        return response()->json([
            'message' => 'Company profile updated successfully.',
            'Updated' => $validatedData
        ], 200);

    }


    public function showCompanyProfile($uuid)
    {
        // Find the company by UUID
        $company = Company::where('uuid', $uuid)->first();

        if (!$company) {
            return response()->json(['error' => 'Company not found.'], 404);
        }

        // Retrieve the supervisor associated with the company
        $supervisor = User::where('company_uuid', $company->uuid)
            ->where('role_id', 2) // Filter by role 3
            ->first();

        $companyData = [
            'name' => $company->name,
            'profilePicture' => $company->profile_picture,
            'banner' => $company->banner,
            'category' => $company->category,
            'location' => $company->location,
            'about' => $company->about,
        ];

        $supervisorData = null;
        if ($supervisor) {
            $supervisorData = [
                'firstName' => $supervisor->first_name,
                'lastName' => $supervisor->last_name,
                'role' => $supervisor->role->name,
                'email' => $supervisor->email,
                'phoneNumber' => $supervisor->phone_number,
            ];
        }

        // Return the protected data as JSON response
        return response()->json([
            'company' => $companyData,
            'supervisor' => $supervisorData,
        ]);
    }

    public function redirectOwnCompanyProfile()
    {
        // Get the authenticated user (supervisor)
        $supervisor = JWTAuth::parseToken()->authenticate();

        // Return the company UUID as a JSON response
        return response()->json([
            'company_uuid' => $supervisor->company_uuid,
        ]);
    }

    public function showAllCompanyProfiles()
    {
        try {
            // Retrieve all companies
            $companies = Company::all();

            if ($companies->isEmpty()) {
                return response()->json(['error' => 'Companies not found.'], 404);
            }

            $companyData = [];

            $url = 'http://192.168.1.78:8080/company/';

            foreach ($companies as $company) {
                // Retrieve the supervisor associated with the company
                $supervisor = User::where('company_uuid', $company->uuid)
                    ->where('role_id', 2) // Filter by supervisor role ID
                    ->first();

                $supervisorData = null;
                if ($supervisor) {
                    $supervisorData = [
                        'firstName' => $supervisor->first_name,
                        'lastName' => $supervisor->last_name,
                        'role' => $supervisor->role->name,
                        'email' => $supervisor->email,
                        'phoneNumber' => $supervisor->phone_number,
                    ];
                }

                $companyData[] = [
                    'uuid' => $company->uuid,
                    'url' => $url . $company->uuid,
                    'name' => $company->name,
                    'profilePicture' => $company->profile_picture,
                    'banner' => $company->banner,
                    'category' => $company->category,
                    'location' => $company->location,
                    'about' => $company->about,
                    'supervisor' => $supervisorData,
                ];
            }

            // Return the company data as JSON response
            return response()->json([
                'companies' => $companyData,
            ]);
        } catch (\Exception $e) {
            // Log the error for debugging purposes
            \Log::error('Error fetching company profiles: ' . $e->getMessage());

            // Return an error response
            return response()->json(['error' => 'An error occurred while fetching company profiles.'], 500);
        }
    }

    public function searchCompanies(Request $request)
    {
        // Get the search query from the request
        $query = $request->input('query');
    
        // Perform the search logic here
        $companies = Company::where('name', 'like', '%' . $query . '%')->get();
    
        // Retrieve supervisor information for each company
        $companiesWithSupervisors = [];
        foreach ($companies as $company) {
            $supervisor = User::where('company_uuid', $company->uuid)
                ->where('role_id', 2) // Filter by supervisor role ID
                ->first();
    
            $supervisorData = null;
            if ($supervisor) {
                $supervisorData = [
                    'firstName' => $supervisor->first_name,
                    'lastName' => $supervisor->last_name,
                    'role' => $supervisor->role->name,
                    'email' => $supervisor->email,
                    'phoneNumber' => $supervisor->phone_number,
                ];
            }
    
            $companiesWithSupervisors[] = [
                'company' => $company,
                'supervisor' => $supervisorData,
                'url' => '$url' . $company->uuid, // Add the URL here
            ];
        }
    
        // Return the results with supervisor information as JSON
        return response()->json(['companies' => $companiesWithSupervisors]);
    }

    public function favoriteCompany($companyId)
    {
        try {
            $company = Company::where('uuid', $companyId)->firstOrFail();
            $teacher = JWTAuth::parseToken()->authenticate();

            // Call the common method for adding to favorites
            $this->addToFavorites($teacher, $company->uuid);

            return response()->json(['message' => 'Company added to favorites']);
        } catch (\Exception $e) {
            // Log the error for debugging purposes
            \Log::error('Error add favorite: ' . $e->getMessage());

            // Return an error response
            return response()->json(['error' => 'An error occurred while adding favorite.'], 500);
        }
    }

    public function removeFavoriteCompany($companyId)
    {
        try {
            $company = Company::where('uuid', $companyId)->firstOrFail();
            $teacher = JWTAuth::parseToken()->authenticate();

            // Call the common method for removing from favorites
            $this->removeFromFavorites($teacher, $company->uuid);

            return response()->json(['message' => 'Company removed from favorites']);
        } catch (\Exception $e) {
            // Log the error for debugging purposes
            \Log::error('Error remove favorite: ' . $e->getMessage());

            // Return an error response
            return response()->json(['error' => 'An error occurred while removing favorite.'], 500);
        }
    }

    // Common method to add company to favorites
    private function addToFavorites($teacher, $companyId)
    {
        $teacher->favorite_companies()->attach($companyId);
    }

    // Common method to remove company from favorites
    private function removeFromFavorites($teacher, $companyId)
    {
        $teacher->favorite_companies()->detach($companyId);
    }

}
