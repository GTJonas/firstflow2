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
            $table->uuid('post_id');
            $table->uuid('supervisor_id');
            $table->date('processing_date');
            $table->text('feedback')->nullable();
            $table->enum('status', [ 'approved', 'rejected'])->default(null);

            $table->timestamps();

            // Define foreign keys
            $table->foreign('post_id')->references('uuid')->on('posts')->onDelete('cascade');
            $table->foreign('supervisor_id')->references('uuid')->on('users')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('processing_history');
    }
}
