<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Course extends Model
{
    use HasFactory;

    protected $fillable = ['name','description','category','location','website','rating','price', 'cover_image','questions','author_id'];
    protected $casts = [
        'questions' => 'array'
    ];

    // Relation N:M with Courses
    public function users(): BelongsToMany
    {
        return $this->belongsToMany(User::class, 'reviews', 'course_id', 'user_id');
    }
    // Relation N:M with technologies
    public function technologies(): BelongsToMany
    {
        return $this->belongsToMany(Technology::class, 'course_technology','course_id', 'technology_id');
    }

    public function authors(): BelongsTo
    {
        return $this->belongsTo(Author::class);
    }
}
