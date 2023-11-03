<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $table = 'reviews';
    public $timestamps = true;
    protected $fillable = ['user_rating','comment','answers','questionnaire','user_id', 'course_id'];
    protected $casts = [
        'answers' => 'array',
        'questionnaire' => 'array'
    ];
}
