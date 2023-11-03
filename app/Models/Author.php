<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Author extends Model
{
    use HasFactory;
    protected $table = 'authors';
    public $timestamps = true;
    protected $fillable = ['name','website','author_rating'];

    public function courses(): HasMany
    {
        return $this->hasMany(Course::class);
    }
}
