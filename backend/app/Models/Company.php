<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Company extends Model
{

    protected $primaryKey = 'uuid';
    public $incrementing = false;
    protected $keyType = 'string';

    protected $fillable = [
        'name',
        'profile_picture',
        'banner',
        'category',
        'location',
        'about',
    ];

    public function supervisors()
    {
        return $this->hasMany(User::class, 'company_uuid', 'uuid')->whereHas('role', function ($query) {
            $query->where('id', '2');
        });
    }

    public function students()
    {
        return $this->hasMany(User::class, 'company_uuid', 'uuid')->whereHas('role', function ($query) {
            $query->where('id', '4');
        });
    }

}
