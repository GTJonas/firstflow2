<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Models\Role;

class CreateRolesTable extends Migration
{
    public function up()
    {
        Schema::create('roles', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->timestamps();
        });

        // Create a user account
        $admin = new Role();
        $admin->id = '1';
        $admin->name = 'Admin';
        $admin->save();

        // Create a user account
        $supervisor = new Role();
        $supervisor->id = '2';
        $supervisor->name = 'Supervisor';
        $supervisor->save();

        // Create a user account
        $teacher = new Role();
        $teacher->id = '3';
        $teacher->name = 'Teacher';
        $teacher->save();

        // Create a user account
        $student = new Role();
        $student->id = '4';
        $student->name = 'Student';
        $student->save();
    }

    public function down()
    {
        Schema::dropIfExists('roles');
    }
}
