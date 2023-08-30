<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use Illuminate\Support\Facades\Hash;
use App\Models\User;

class CreateUsersTable extends Migration
{
    public function up()
    {
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('uuid')->primary();
            $table->string('first_name');
            $table->string('last_name');
            $table->string('email')->unique();
            $table->string('password');
            $table->unsignedBigInteger('role_id');

            // Get the server's IP address using gethostbyname()
            $serverIP = gethostbyname(gethostname());

            // Get the server's port from $_SERVER variable
            $serverPort = $_SERVER['SERVER_PORT'] ?? 8000; // Use port 8000 as default if not set

            // Use the server's IP and port in your code
            $storagePath = 'http://' . $serverIP . ':' . $serverPort . '/storage/';

            $table->string('profile_picture')->default($storagePath . 'default.png');
            $table->string('phone_number')->nullable(); // Add phone_number column
            $table->text('bio')->nullable(); // Add bio column
            $table->rememberToken();
            $table->timestamps();

            $table->foreign('role_id')->references('id')->on('roles');
        });

        // Create a user account
        $admin = new User();
        $admin->uuid = Str::uuid()->toString(); // Generate a UUID
        $admin->first_name = 'Mr.';
        $admin->last_name = 'Admin';
        $admin->email = 'admin@admin.com';
        $admin->password = Hash::make('admin');
        $admin->role_id = 1; // Set the appropriate role ID
        $admin->save();

        // Create supervisor
        $supervisor = new User();
        $supervisor->uuid = Str::uuid()->toString(); // Generate a UUID
        $supervisor->first_name = 'Texas';
        $supervisor->last_name = 'Forslund';
        $supervisor->email = 'texas@supervisor.com';
        $supervisor->password = Hash::make('supervisor');
        $supervisor->role_id = 2; // Set the appropriate role ID for supervisor
        $supervisor->save();

        $supervisor2 = new User();
        $supervisor2->uuid = Str::uuid()->toString(); // Generate a UUID
        $supervisor2->first_name = 'Las Vegas';
        $supervisor2->last_name = 'Forslund';
        $supervisor2->email = 'lasvegas@supervisor.com';
        $supervisor2->password = Hash::make('supervisor');
        $supervisor2->role_id = 2; // Set the appropriate role ID for supervisor
        $supervisor2->save();

        // Create teacher
        $teacher = new User();
        $teacher->uuid = Str::uuid()->toString(); // Generate a UUID
        $teacher->first_name = 'Stefan';
        $teacher->last_name = 'Näslund';
        $teacher->email = 'stefan@teacher.com';
        $teacher->password = Hash::make('teacher');
        $teacher->role_id = 3; // Set the appropriate role ID for supervisor
        $teacher->save();

        $teacher2 = new User();
        $teacher2->uuid = Str::uuid()->toString(); // Generate a UUID
        $teacher2->first_name = 'Elon';
        $teacher2->last_name = 'Musk';
        $teacher2->email = 'elon@teacher.com';
        $teacher2->password = Hash::make('teacher');
        $teacher2->role_id = 3; // Set the appropriate role ID for supervisor
        $teacher2->save();

        // Create student
        $student = new User();
        $student->uuid = Str::uuid()->toString(); // Generate a UUID
        $student->first_name = 'Paul';
        $student->last_name = 'Kittensberg';
        $student->email = 'paul@student.com';
        $student->password = Hash::make('student');
        $student->role_id = 4; // Set the appropriate role ID for supervisor
        $student->save();

        $student2 = new User();
        $student2->uuid = Str::uuid()->toString(); // Generate a UUID
        $student2->first_name = 'Jonas';
        $student2->last_name = 'Lindström';
        $student2->email = 'jonas@student.com';
        $student2->password = Hash::make('student');
        $student2->role_id = 4; // Set the appropriate role ID for supervisor
        $student2->save();
    }

    public function down()
    {
        Schema::dropIfExists('users');
    }
}

