<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Answer;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class AnswerController extends Controller
{
    public function getAllAnswers()
    {
        try 
        {
            $allAnswers = Answer::all();
            return response()->json([
                'success' => true,
                'data' => $allAnswers,
                'message' => 'All Answers retrieving successfully'
            ], 200);

        } catch (\Exception $error) 
        {
            return response()->json([
                'message' => 'Error getting Answers',
                'error' => $error->getMessage()
            ], 500);
        }
    }

    public function getAnswerById($id)
    {
        try 
        {
            $answerById = Answer::with(['review','question'])->find($id);

            if (!$answerById) 
            {
                return response()->json([
                    'message' => 'No answer with that id has been found'
                ], 404);
            }
            return response()->json([
                'success' => true,
                'data' => $answerById,
                'message' => 'answer by id retrieving successfully'
            ], 200);

        } catch (\Exception $error) 
        {
            return response()->json([
                'message' => 'An error occurred while getting answer',
                'error' => $error->getMessage()
            ], 500); 
        }
    }

    public function createAnswer(Request $request)
    {
        try 
        {
            $validations = [
                'content' => 'required|string',
                'review_id' => 'required|numeric',
                'question_id' => 'required|numeric'
            ];
    
            $validations_messages = [
                'required' => 'El campo :attribute es obligatorio.',
                'string' => 'El campo :attribute debe ser un string',
                'numeric' => 'El campo :attribute debe ser numerico'
            ];
        
            $this->validate($request, $validations, $validations_messages);
            
            $createdAnswer = new Answer;
            $createdAnswer->content = $request->input('content');
            $createdAnswer->review_id = $request->input('review_id');
            $createdAnswer->question_id = $request->input('question_id');
    
            $createdAnswer->save();
    
            return response()->json([
                'success' => true,
                'data' => $createdAnswer,
                'message' => 'Answer created successfully'
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
                'message' => 'An error occurred while creating the Answer',
                'error' => $error->getMessage()
            ], 500); 
        }
    }

    public function updatedAnswer(Request $request, $id)
    {
        try 
        {
            $updatedAnswer = Answer::find($id);

            if (!$updatedAnswer) 
            {
                return response()->json([
                    'message' => 'No Answer with that id has been found'
                ], 404);
            }

            $validations = [
                'content' => 'string',
                'review_id' => 'numeric',
                'question_id' => 'numeric',
            ];

            $validations_messages = [
                'string' => 'El campo :attribute debe ser string.',
                'numeric' => 'El campo :attribute debe ser numerico'
            ];
        
            $this->validate($request, $validations, $validations_messages);
            
            $fieldsToUpdate = ['content','review_id','question_id'];
            
            foreach ($fieldsToUpdate as $field)
            {
                if ($request->has($field))
                {
                    $updatedAnswer->{$field} = $request->input($field);
                }
            }

            $updatedAnswer->save();

            return response()->json([
                'success' => true,
                'data' => $updatedAnswer,
                'message' => 'Answer updated successfully'
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
                'message' => 'An error occurred while updating the Answer',
                'error' => $error->getMessage()
            ], 500); 
        }
    }

    public function deleteAnswer($id)
    {
        try 
        {
            $deletedAnswer = Answer::find($id);

            if (!$deletedAnswer) 
            {
                return response()->json([
                    'message' => 'No Answer with that id has been found'
                ], 404);
            }
            
            $deletedAnswer->delete();
    
            return response()->json([
                'success' => true,
                'message' => 'Answer deleted successfully'
            ], 200);
        
        } catch (\Exception $error) 
        {
            return response()->json([
                'message' => 'An error occurred while deleting the Answer',
                'error' => $error->getMessage()
            ], 500);  
        }
    }
}
