<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;
use App\Http\Models\Post;
use App\Http\Models\User;

class CreatePostsTable extends Migration
{
    public function up()
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->uuid()->primary();
            $table->text('content');
            $table->uuid('user_uuid')->nullable();
            $table->uuid('handled_by')->nullable(); // Foreign key to the users table
            $table->string('image')->nullable();
            $table->time('from')->nullable();
            $table->time('to')->nullable();
            $table->timestamps();   
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');
            $table->foreign('user_uuid')->references('uuid')->on('users')->onDelete('cascade');
        });

    }

    public function down()
    {
        Schema::dropIfExists('posts');
    }
}
