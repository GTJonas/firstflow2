<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class AddProcessingHistoryIdToPosts extends Migration
{
    public function up()
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->unsignedBigInteger('processing_history_id')->nullable()->after('handled_by'); // Add this column
            $table->foreign('processing_history_id')->references('id')->on('processing_history')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::table('posts', function (Blueprint $table) {
            $table->dropForeign(['processing_history_id']);
            $table->dropColumn('processing_history_id');
        });
    }
}
