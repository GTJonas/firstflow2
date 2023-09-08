<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateProcessingHistoryTable extends Migration
{
    public function up()
    {
        Schema::create('processing_history', function (Blueprint $table) {
            $table->id();
            $table->uuid('user_id');
            $table->uuid('post_id');
            $table->uuid('supervisor_id')->nullable();
            $table->date('processing_date')->nullable();
            $table->text('feedback')->nullable();
            $table->enum('status', ['pending', 'approved', 'rejected'])->default('pending');

            $table->timestamps();

            // Define foreign keys->onDelete('cascade');
            $table->foreign('post_id')->references('uuid')->on('posts')->onDelete('cascade');
            $table->foreign('supervisor_id')->references('uuid')->on('users')->onDelete('cascade');
            $table->foreign('user_id')->references('uuid')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('processing_history');
    }
}
