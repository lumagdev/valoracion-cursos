<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;
use Illuminate\Validation\ValidationException;

class ReviewController extends Controller
{
    public function getAllReviews()
    {
        try 
        {
            $allReviews = Review::all();
            return response()->json([
                'success' => true,
                'data' => $allReviews,
                'message' => 'Request OK'
            ], 200);

        } catch (\Exception $error) 
        {
            return response()->json([
                'message' => 'Error getting reviews',
                'error' => $error->getMessage()
            ], 500);
        }
    }

    public function getReviewById($id)
    {
        $reviewById = Review::find($id);

        if (!isset($reviewById)) 
        {
            return response()->json([
                'message' => 'No review with that id has been found'
            ], 404);
        }
        return response()->json([
            'success' => true,
            'data' => $reviewById,
            'message' => 'Request OK'
        ], 200);
    }

    public function createReview(Request $request)
    {
        $validations = [
            'name' => 'required',
            'user_rating' => 'required|numeric',
            'comment' => 'required',
            'answers' => 'required',
            'questionnarie' => 'required',
            'user_id' => 'required',
            'course_id' => 'required',
        ];

        $validations_messages = [
            'required' => 'El campo :attribute es obligatorio.',
            'numeric' => 'El campo :attribute debe ser numerico',
        ];
    
        try 
        {
            $this->validate($request, $validations, $validations_messages);
        } catch (ValidationException $error) 
        {
            return response()->json([
                'message' => 'Check the fields, there is an error',
                'errors' => $error->errors()
            ], 422); 
        }

        $createdReview = new Review;
        $createdReview->name = $request->input('name');
        $createdReview->user_rating = $request->input('user_rating');
        $createdReview->comment = $request->input('comment');
        $createdReview->answers = $request->input('answers');
        $createdReview->questionnarie = $request->input('questionnarie');
        $createdReview->user_id = $request->input('user_id');
        $createdReview->course_id = $request->input('course_id');

        $createdReview->save();

        return response()->json([
            'success' => true,
            'data' => $createdReview,
            'message' => 'Technology created successfully'
        ], 201);
    }

    public function updatedReview(Request $request, $id)
    {
        $updatedReview = Review::find($id);

        if (!isset($updatedReview)) 
        {
            return response()->json([
                'message' => 'No Review with that id has been found'
            ], 404);
        }

        $validations = [
            'name' => 'required',
            'user_rating' => 'required|numeric',
            'comment' => 'required',
            'answers' => 'required',
            'questionnarie' => 'required',
            'user_id' => 'required',
            'course_id' => 'required',
        ];

        $validations_messages = [
            'required' => 'El campo :attribute es obligatorio.',
            'numeric' => 'El campo :attribute debe ser numerico',
        ];
    
        try 
        {
            $this->validate($request, $validations, $validations_messages);
        } catch (ValidationException $error) 
        {
            return response()->json([
                'message' => 'Check the fields, there is an error',
                'errors' => $error->errors()
            ], 422); 
        }

        $updatedReview = new Review;
        $updatedReview->name = $request->input('name');
        $updatedReview->user_rating = $request->input('user_rating');
        $updatedReview->comment = $request->input('comment');
        $updatedReview->answers = $request->input('answers');
        $updatedReview->questionnarie = $request->input('questionnarie');
        $updatedReview->user_id = $request->input('user_id');
        $updatedReview->course_id = $request->input('course_id');

        $updatedReview->save();

        return response()->json([
            'success' => true,
            'data' => $updatedReview,
            'message' => 'Review updated successfully'
        ], 201);
    }

    public function deleteReview($id)
    {
        $deletedReview = Review::find($id);

        if (!isset($deletedReview)) 
        {
            return response()->json([
                'message' => 'No Review with that id has been found'
            ], 404);
        }
        
        $deletedReview->delete();

        return response()->json([
            'success' => true,
            'message' => 'Review deleted successfully'
        ], 200);
    }
}
