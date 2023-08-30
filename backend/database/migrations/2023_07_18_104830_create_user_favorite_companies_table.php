<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

class CreateUserFavoriteCompaniesTable extends Migration
{
    public function up()
    {
        Schema::create('user_favorite_companies', function (Blueprint $table) {
            $table->uuid('user_id');
            $table->uuid('company_id');
            $table->foreign('user_id')->references('uuid')->on('users')->onDelete('cascade');
            $table->foreign('company_id')->references('uuid')->on('companies')->onDelete('cascade');
            $table->timestamps();
    
            // Unique combination of user_id and company_id
            $table->unique(['user_id', 'company_id']);
        });
    }
    
    public function down()
    {
        Schema::dropIfExists('user_favorite_companies');
    }
}
