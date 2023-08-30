<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddCompanyAndClassToPostsTable extends Migration
{
    public function up()
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->unsignedBigInteger('class_id')->nullable();
            $table->uuid('company_id')->nullable();

            // Create foreign key for class_id referencing the classes table
            $table->foreign('class_id')->references('id')->on('school_classes')->onDelete('set null');

            // Add any other necessary foreign keys or indexes here
        });
    }

    public function down()
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropForeign(['class_id']);
            $table->dropColumn(['class_id', 'company_id']);
        });
    }
}
