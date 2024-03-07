<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

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
        return $this->belongsToMany(Technology::class, 'courses_technologies','course_id', 'technology_id');
    }

    // Relation M:M with User
    public function reviews(): HasMany
    {
        return $this->hasMany(Review::class);
    }

    public function authors(): BelongsTo
    {
        return $this->belongsTo(Author::class, 'author_id');
    }

    //Obtener los 3 mejores cursos
    public static function getCoursesWithHighestRatings($limit = 3)
    {
        return Course::with((['authors','technologies']))->orderBy('rating','desc')->take($limit)->get();
    }
}
