<?php

namespace App\Observers;

use App\Models\Review;
use App\Models\Course;

class ReviewObserver
{
    // Se ejecutara cada vez que review sea creado, editado o eliminado
    /**
     * Handle the Review "created" event.
     */
    public function created(Review $review): void
    {
        $this->updateCourseRating($review->course_id);
    }

    /**
     * Handle the Review "updated" event.
     */
    public function updated(Review $review): void
    {
        $this->updateCourseRating($review->course_id);
    }

    /**
     * Handle the Review "deleted" event.
     */
    public function deleted(Review $review): void
    {
        $this->updateCourseRating($review->course_id);
    }

    /**
     * Handle the Review "restored" event.
     */
    public function restored(Review $review): void
    {
        //
    }

    /**
     * Handle the Review "force deleted" event.
     */
    public function forceDeleted(Review $review): void
    {
        //
    }

    // Con esto calcularemos la media de todos los user_rating y lo agregaremos en el campo rating de course
    private function updateCourseRating($course_id)
    {
        $course = Course::find($course_id);
        if ($course) 
        {
            $average_rating = Review::where('course_id', $course_id)->avg('user_rating');
            // Redondeamos para q solo sea con una parte decimal
            $rounded_rating = round($average_rating, 1);
            $course->rating = $rounded_rating;
            $course->save();
        }
    }
}
