<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Review extends Model
{
    use HasFactory;

    protected $table = 'reviews';
    public $timestamps = true;
    protected $fillable = ['user_rating','title','comment','answers','questionnaire','user_id', 'course_id'];
    protected $casts = [
        'answers' => 'array',
        'questionnaire' => 'array'
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function course()
    {
        return $this->belongsTo(Course::class);
    }
}
