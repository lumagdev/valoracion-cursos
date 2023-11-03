<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;

class Technology extends Model
{
    use HasFactory;
    protected $table = 'Technologies';
    public $timestamps = true;
    protected $fillable = ['name'];

    // Relation N:M with technologies
    public function courses(): BelongsToMany
    {
        return $this->belongsToMany(Course::class, 'course_technology','technology_id', 'course_id');
    }
}
