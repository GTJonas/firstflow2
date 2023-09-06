<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class ProcessingHistory extends Model
{
    use HasFactory;

    // Define the table name (if it's not inferred from the class name)
    protected $table = 'processing_history';

    // Define the columns that can be mass assigned
    protected $fillable = [
        'post_id',
        'supervisor_id',
        'user_id',
        'processing_date',
        'feedback',
        'status',
    ];

    // Add any additional methods or relationships here
}
