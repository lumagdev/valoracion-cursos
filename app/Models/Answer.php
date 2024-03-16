<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Answer extends Model
{
    use HasFactory;

    protected $fillable = ['content','review_id','question_id'];

    public function question()
    {
        return $this->belongsTo(Question::class);
    }

    public function review()
    {
        return $this->belongsTo(Review::class);
    }
}
