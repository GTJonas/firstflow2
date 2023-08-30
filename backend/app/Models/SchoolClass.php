<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SchoolClass extends Model
{
    protected $fillable = ['name', 'school_id', 'teacher_id'];

    public function school()
    {
        return $this->belongsTo(School::class);
    }

    public function teacher()
    {
        return $this->belongsTo(User::class, 'teacher_id');
    }

    public function students()
    {
        return $this->hasMany(User::class, 'class_id');
    }

    public function posts()
    {
        return $this->hasMany(Post::class, 'class_id'); // Use 'class_id' as the foreign key
    }

    public function company()
    {
        return $this->belongsTo(Company::class); // Assuming you have a Company model
    }

}

