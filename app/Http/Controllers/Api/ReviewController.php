<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Review;
use App\Models\Answer;
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
                'message' => 'Review by id retrieving successfully'
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
                'title' => 'required|string',
                'comment' => 'required',
                'user_id' => 'required',
                'course_id' => 'required',
                //Datos que no se guardan en el modelo answers[{question_id,content}]
                'answers' => 'required|array',
                'answers.*.question_id' => 'required|integer|exists:questions,id',
                'answers.*.content' => 'required|string'
            ];
    
            $validations_messages = [
                'required' => 'El campo :attribute es obligatorio.',
                'numeric' => 'El campo :attribute debe ser numerico',
                'array' => 'El campo :attribute debe ser un array',
                'integer' => 'El campo :attribute debe ser un integer',
                'string' => 'El campo :attribute debe ser un string',
                'answers.required' => 'El campo :attribute es obligatorio.',
                'answers.array' => 'El campo :attribute debe ser un array.',
                'answers.*.question_id.required' => 'El campo question_id es obligatorio en todas las respuestas.',
                'answers.*.question_id.integer' => 'El campo question_id debe ser un entero en todas las respuestas.',
                'answers.*.question_id.exists' => 'El valor del campo question_id en una de las respuestas no es válido.',
                'answers.*.content.required' => 'El campo content es obligatorio en todas las respuestas.',
                'answers.*.content.string' => 'El campo content debe ser un string en todas las respuestas.'
            ];
        
            $this->validate($request, $validations, $validations_messages);

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
            $createdReview->title = $request->input('title');
            $createdReview->comment = $request->input('comment');
            $createdReview->user_id = $request->input('user_id');
            $createdReview->course_id = $request->input('course_id');
    
            $createdReview->save();

            // Guardar las respuestas del usuario
            // [{"question_id":'', "content":''}]
            foreach ($request->answers as $answer) 
            {
                $answerData = new Answer([
                    'question_id' => $answer['question_id'],
                    'content' => $answer['content']
                ]);
                $createdReview->answers()->save($answerData); 
            }
    
            return response()->json([
                'success' => true,
                'data' => $createdReview,
                'message' => 'Review created successfully'
            ], 201);       
        }
        catch (ValidationException $error) 
        {
            return response()->json([
                'message' => 'Check the fields, there is an error',
                'errors' => $error->errors()
            ], 422); 
        }
        catch (\Exception $error) {
            return response()->json([
                'message' => 'An error occurred while creating the review',
                'error' => $error->getMessage()
            ], 500); 
        }
    }

    public function updateReview(Request $request, $id)
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
                'user_id' => 'numeric',
                'course_id' => 'numeric',
                'answers' => 'array'
            ];

            $validations_messages = [
                'required' => 'El campo :attribute es obligatorio.',
                'numeric' => 'El campo :attribute debe ser numerico',
                'array' => 'El campo :attribute debe ser un array'
            ];
        
            $this->validate($request, $validations, $validations_messages);

            $fieldsToUpdate = ['user_rating','title','comment','user_id','course_id'];
            
            foreach ($fieldsToUpdate as $field)
            {
                if ($request->has($field))
                {
                    $updatedReview->{$field} = $request->input($field);
                }
            }

            $updatedReview->save();

            // Asignamos respuestas a la reviews si se pasan
            foreach ($request->answers as $answer) 
            {
                $answerData = Answer::findOrFail($answer['id']);
                $answerData->update(['content' => $answer['content']]);
            }

            return response()->json([
                'success' => true,
                'data' => $updatedReview,
                'message' => 'Review updated successfully'
            ], 201);  
        }
        catch (ValidationException $error) 
        {
            return response()->json([
                'message' => 'Check the fields, there is an error',
                'errors' => $error->errors()
            ], 422); 
        }
        catch (\Exception $error) 
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
            $allReviewsByCourse = Review::with(['user','answers.question'])->where('course_id', $courseId)->get();
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
            $allReviewsByUser = Review::with('course.authors')->where('user_id', $userId)->get();
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

    public function getQuestionsAndAnswersForUserReview($courseId, $userId)
    {
        try 
        {
            $reviews = Review::with(['answers.question'])
                ->where('user_id', $userId)
                ->where('course_id', $courseId)
                ->get();

            if ($reviews->isEmpty()) 
            {
                return response()->json([
                    'message' => 'No reviews found for the specified user and course'
                ], 404);
            }

            $questionsAndAnswers = [];

            foreach ($reviews as $review) {
                foreach ($review->answers as $answer) {
                    $questionsAndAnswers[] = [
                        'questionId' => $answer->question->id,
                        'question' => $answer->question->content,
                        'answerId' => $answer->id,
                        'answer' => $answer->content,
                    ];
                }
            }

            return response()->json($questionsAndAnswers);

        } 
        catch(\Exception $error) 
        {
            return response()->json([
                'message' => 'An error occurred while getting questions and answers for the user review',
                'error' => $error->getMessage()
            ], 500); 
        }
    }
}
