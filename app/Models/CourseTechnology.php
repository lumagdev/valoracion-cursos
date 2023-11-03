<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class CourseTechnology extends Model
{
    use HasFactory;

    protected $table = ['courses_technologies'];
    protected $fillable = ['course_id', 'technology_id'];
}
