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
            $allReviews = Review::with(['user','course'])->get();
            return response()->json([
                'success' => true,
                'data' => $allReviews,
                'message' => 'All reviews retrieving successfully'
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
        try 
        {
            $reviewById = Review::with(['user','course'])->find($id);

            if (!isset($reviewById)) 
            {
                return response()->json([
                    'message' => 'No review with that id has been found'
                ], 404);
            }
            return response()->json([
                'success' => true,
                'data' => $reviewById,
                'message' => 'Course by id retrieving successfully'
            ], 200);

        } catch (\Exception $error) 
        {
            return response()->json([
                'message' => 'An error occurred while getting review',
                'error' => $error->getMessage()
            ], 500); 
        }

    }

    public function createReview(Request $request)
    {
        try 
        {
            $validations = [
                'user_rating' => 'required|numeric',
                'comment' => 'required',
                'answers' => 'required|array',
                'questionnaire' => 'required|array',
                'user_id' => 'required',
                'course_id' => 'required',
            ];
    
            $validations_messages = [
                'required' => 'El campo :attribute es obligatorio.',
                'numeric' => 'El campo :attribute debe ser numerico',
                'array' => 'El campo :attribute debe ser un array',
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

            // Verificar si ese usuario ya ha creado una review de ese curso
            $user_id = $request->input('user_rating');
            $course_id = $request->input('course_id');
            $existingReview = Review::where('user_rating',$user_id)->where('course_id',$course_id)->first();

            if ($existingReview) 
            {
                return response()->json([
                    'message' => 'Ya has creado una opinión en este curso',
                ], 422); 
            }
    
            $createdReview = new Review;
            $createdReview->user_rating = $request->input('user_rating');
            $createdReview->comment = $request->input('comment');
            $createdReview->answers = $request->input('answers');
            $createdReview->questionnaire = $request->input('questionnaire');
            $createdReview->user_id = $request->input('user_id');
            $createdReview->course_id = $request->input('course_id');
    
            $createdReview->save();
    
            return response()->json([
                'success' => true,
                'data' => $createdReview,
                'message' => 'Review created successfully'
            ], 201);       
        
        } catch (\Exception $error) {
            return response()->json([
                'message' => 'An error occurred while creating the review',
                'error' => $error->getMessage()
            ], 500); 
        }

    }

    public function updatedReview(Request $request, $id)
    {
        try 
        {
            $updatedReview = Review::find($id);

            if (!isset($updatedReview)) 
            {
                return response()->json([
                    'message' => 'No Review with that id has been found'
                ], 404);
            }

            $validations = [
                'user_rating' => 'numeric',
                'comment' => 'string',
                'answers' => 'array',
                'questionnaire' => 'array',
                'user_id' => 'numeric',
                'course_id' => 'numeric',
            ];

            $validations_messages = [
                'required' => 'El campo :attribute es obligatorio.',
                'numeric' => 'El campo :attribute debe ser numerico',
                'array' => 'El campo :attribute debe ser un array'
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

            $fieldsToUpdate = ['user_rating','comment','answers','questionnaire','user_id','course_id'];
            
            foreach ($fieldsToUpdate as $field)
            {
                if ($request->has($field))
                {
                    $updatedReview->{$field} = $request->input($field);
                }
            }

            $updatedReview->save();

            return response()->json([
                'success' => true,
                'data' => $updatedReview,
                'message' => 'Review updated successfully'
            ], 201);  
        
        } catch (\Exception $error) 
        {
            return response()->json([
                'message' => 'An error occurred while updating the review',
                'error' => $error->getMessage()
            ], 500); 
        }
    }

    public function deleteReview($id)
    {
        try 
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
        
        } catch (\Exception $error) 
        {
            return response()->json([
                'message' => 'An error occurred while deleting the review',
                'error' => $error->getMessage()
            ], 500);  
        }
    }

    public function getAllReviewsOfACourse($courseId)
    {
        try 
        {
            $allReviewsByCourse = Review::with(['user'])->where('course_id', $courseId)->get();
            return response()->json([
                'success' => true,
                'data' => $allReviewsByCourse,
                'message' => 'Reviews of a course retrieving successfully'
            ], 200);

        } catch (\Exception $error) 
        {
            return response()->json([
                'message' => 'Error getting reviews',
                'error' => $error->getMessage()
            ], 500);
        }
    }

    public function getAllReviewsOfAUser($userId)
    {
        try 
        {
            //Trae todas las reviews del usuario con la informacion de los cursos y sus autores
            $allReviewsByUser = Review::with(['course.authors'])->where('user_id', $userId)->get();
            return response()->json([
                'success' => true,
                'data' => $allReviewsByUser,
                'message' => 'Reviews of a user retrieving successfully'
            ], 200);

        } catch (\Exception $error) 
        {
            return response()->json([
                'message' => 'Error getting reviews',
                'error' => $error->getMessage()
            ], 500);
        }
    }
}
