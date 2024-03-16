<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;

class QuestionController extends Controller
{
    public function getAllQuestions()
    {
        try 
        {
            $allQuestions = Question::all();
            return response()->json([
                'success' => true,
                'data' => $allQuestions,
                'message' => 'All questions retrieving successfully'
            ], 200);

        } catch (\Exception $error) 
        {
            return response()->json([
                'message' => 'Error getting questions',
                'error' => $error->getMessage()
            ], 500);
        }
    }

    public function getQuestionById($id)
    {
        try 
        {
            $questionById = Question::with('course')->find($id);

            if (!$questionById) 
            {
                return response()->json([
                    'message' => 'No question with that id has been found'
                ], 404);
            }
            return response()->json([
                'success' => true,
                'data' => $questionById,
                'message' => 'Question by id retrieving successfully'
            ], 200);

        } catch (\Exception $error) 
        {
            return response()->json([
                'message' => 'An error occurred while getting question',
                'error' => $error->getMessage()
            ], 500); 
        }
    }

    public function createQuestion(Request $request)
    {
        try 
        {
            $validations = [
                'content' => 'required|string',
                'course_id' => 'required'
            ];
    
            $validations_messages = [
                'required' => 'El campo :attribute es obligatorio.',
                'string' => 'El campo :attribute debe ser un string'
            ];
        
            $this->validate($request, $validations, $validations_messages);
            
            $createdQuestion = new Question;
            $createdQuestion->content = $request->input('content');
            $createdQuestion->course_id = $request->input('course_id');
    
            $createdQuestion->save();
    
            return response()->json([
                'success' => true,
                'data' => $createdQuestion,
                'message' => 'Question created successfully'
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
                'message' => 'An error occurred while creating the question',
                'error' => $error->getMessage()
            ], 500); 
        }
    }

    public function updatedQuestion(Request $request, $id)
    {
        try 
        {
            $updatedQuestion = Question::find($id);

            if (!$updatedQuestion) 
            {
                return response()->json([
                    'message' => 'No Question with that id has been found'
                ], 404);
            }

            $validations = [
                'content' => 'string',
                'course_id' => 'numeric',
            ];

            $validations_messages = [
                'string' => 'El campo :attribute debe ser string.',
                'numeric' => 'El campo :attribute debe ser numerico'
            ];
        
            $this->validate($request, $validations, $validations_messages);

            $fieldsToUpdate = ['content','course_id'];
            
            foreach ($fieldsToUpdate as $field)
            {
                if ($request->has($field))
                {
                    $updatedQuestion->{$field} = $request->input($field);
                }
            }

            $updatedQuestion->save();

            return response()->json([
                'success' => true,
                'data' => $updatedQuestion,
                'message' => 'Question updated successfully'
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
                'message' => 'An error occurred while updating the question',
                'error' => $error->getMessage()
            ], 500); 
        }
    }

    public function deleteQuestion($id)
    {
        try 
        {
            $deletedQuestion = Question::find($id);

            if (!$deletedQuestion) 
            {
                return response()->json([
                    'message' => 'No Question with that id has been found'
                ], 404);
            }
            
            $deletedQuestion->delete();
    
            return response()->json([
                'success' => true,
                'message' => 'Question deleted successfully'
            ], 200);
        
        } catch (\Exception $error) 
        {
            return response()->json([
                'message' => 'An error occurred while deleting the Question',
                'error' => $error->getMessage()
            ], 500);  
        }
    }

    public function getQuestionsOfACourse($id)
    {
        try 
        {
            $allQuestionsByCourse = Question::where('course_id', $id)->get();
            return response()->json([
                'success' => true,
                'data' => $allQuestionsByCourse,
                'message' => 'Questions of a course retrieving successfully'
            ], 200);

        } catch (\Exception $error) 
        {
            return response()->json([
                'message' => 'Error getting questions',
                'error' => $error->getMessage()
            ], 500);
        }
    }
}
