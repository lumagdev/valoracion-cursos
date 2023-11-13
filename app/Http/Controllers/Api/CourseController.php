<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
class CourseController extends Controller
{
    public function getAllCourses()
    {
        try 
        {
            $allCourses = Course::all();
            return response()->json([
                'success' => true,
                'data' => $allCourses,
                'message' => 'Request OK'
            ], 200);

        } catch (\Exception $error) 
        {
            return response()->json([
                'message' => 'Error getting courses',
                'error' => $error->getMessage()
            ], 500);
        }
    }
    
    public function getCourseById($id)
    {
        try
        {
            $courseById = Course::find($id);

            if (!isset($courseById)) 
            {
                return response()->json([
                    'message' => 'No course with that id has been found'
                ], 404);
            }
            return response()->json([
                'success' => true,
                'data' => $courseById,
                'message' => 'Request OK'
            ], 200);
        }
        catch(\Exception $error)
        {
            return response()->json([
                'message' => 'An error occurred while getting course',
                'error' => $error->getMessage()
            ], 500); 
        }
    }

    public function createCourse(Request $request)
    {
        try
        {
            $validations = [
                'name' => 'required',
                'description' => 'required',
                'category' => 'required',
                'location' => 'required',
                'website' => 'required',
                'rating' => 'required|numeric',
                'cover_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
                'questions' => 'required|array',
                'author_id' => 'required',
            ];

            $validations_messages = [
                'required' => 'El campo :attribute es obligatorio.',
                'numeric' => 'El campo :attribute debe ser numerico',
                'image' => 'El campo :attribute debe ser una imagen válida.',
                'mimes' => 'El campo :attribute debe ser una imagen en formato JPEG, PNG, JPG o GIF.',
                'max' => 'El campo :attribute no debe ser mayor de 2 MB.',
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

            if ($request->hasFile('cover_image')) 
            {
                $imagePath = $request->file('cover_image')->store('/courses', 'images'); 
            }

            $createdCourse = new Course;
            $createdCourse->name = $request->input('name');
            $createdCourse->description = $request->input('description');
            $createdCourse->category = $request->input('category');
            $createdCourse->location = $request->input('location');
            $createdCourse->website = $request->input('website');
            $createdCourse->rating = $request->input('rating');
            $createdCourse->price = $request->input('price');
            $createdCourse->cover_image = $imagePath;
            $createdCourse->questions = $request->input('questions');
            $createdCourse->author_id = $request->input('author_id');
            
            $createdCourse->save();

            return response()->json([
                'success' => true,
                'data' => $createdCourse,
                'message' => 'Course created successfully'
            ], 201);
        }
        catch(\Exception $error)
        {
            return response()->json([
                'message' => 'An error occurred while creating the course',
                'error' => $error->getMessage()
            ], 500); 
        }
    }

    public function updateCourse(Request $request, $id)
    {
        try 
        {
            $updatedCourse = Course::find($id);
        
            if (!isset($updatedCourse)) 
            {
                return response()->json([
                    'message' => 'No course with that id has been found'
                ], 404);
            }
            
            $validations = [
                'name' => 'required',
                'description' => 'required',
                'category' => 'required',
                'location' => 'required',
                'website' => 'required',
                'rating' => 'required|numeric',
                'cover_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
                'questions' => 'required|array',
                'author_id' => 'required',
            ];
    
            $validations_messages = [
                'required' => 'El campo :attribute es obligatorio.',
                'numeric' => 'El campo :attribute debe ser numerico',
                'image' => 'El campo :attribute debe ser una imagen válida.',
                'mimes' => 'El campo :attribute debe ser una imagen en formato JPEG, PNG, JPG o GIF.',
                'max' => 'El campo :attribute no debe ser mayor de 2 MB.',
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
        
            if ($request->hasFile('cover_image')) 
            {
                Storage::disk('images')->delete($updatedCourse->cover_image);
    
                $imagePath = $request->file('image')->store('/courses', 'images');
                $updatedCourse->cover_image = $imagePath;
            }
    
            $updatedCourse->name = $request->input('name');
            $updatedCourse->description = $request->input('description');
            $updatedCourse->category = $request->input('category');
            $updatedCourse->location = $request->input('location');
            $updatedCourse->website = $request->input('website');
            $updatedCourse->rating = $request->input('rating');
            $updatedCourse->price = $request->input('price');
            $updatedCourse->questions = $request->input('questions');
            $updatedCourse->author_id = $request->input('author_id');
    
            $updatedCourse->save();
    
            return response()->json([
                'success' => true,
                'data' => $updatedCourse,
                'message' => 'Course updated successfully'
            ], 201);
        } catch (\Exception $error) 
        {
            return response()->json([
                'message' => 'An error occurred while updating the course',
                'error' => $error->getMessage()
            ], 500); 
        }
    }

    public function deleteCourse($id)
    {
        try 
        {
            $deletedCourse = Course::find($id);

            if (!isset($deletedCourse)) 
            {
                return response()->json([
                    'message' => 'No Course with that id has been found'
                ], 404);
            }
            
            $deletedCourse->delete();

            return response()->json([
                'success' => true,
                'message' => 'Course deleted successfully'
            ], 200);

        } catch (\Exception $error) 
        {
            return response()->json([
                'message' => 'An error occurred while deleting the course',
                'error' => $error->getMessage()
            ], 500); 
        }
    }
}
