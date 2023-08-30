<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Post extends Model
{
    protected $primaryKey = 'uuid';
    public $incrementing = false;
    protected $keyType = 'string';
    protected $except = [
        '/api/*',
    ];


    protected $fillable = ['content', 'image', 'user_uuid', 'status', 'handled_by', 'from', 'to'];

    public function user()
    {
        return $this->belongsTo(User::class, 'user_uuid', 'uuid');
    }

    public function schoolClass()
    {
        return $this->belongsTo(SchoolClass::class, 'class_id'); // Adjust the foreign key column name as needed
    }

    protected $casts = [
        'status' => 'string',
    ];

}

