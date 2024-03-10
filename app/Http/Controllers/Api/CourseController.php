<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Course;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
use Illuminate\Validation\Rule;
class CourseController extends Controller
{
    public function getAllCourses()
    {
        try 
        {
            // if (Auth::user()->hasAnyRole(['admin', 'common']) )
            // {
            $allCourses = Course::with(['authors','technologies','reviews'])->get();
            return response()->json([
                'success' => true,
                'data' => $allCourses,
                'message' => 'All courses retrieving successfully'
            ], 200);
            // }
            // else
            // {
            //     return response()->json([
            //         'message' => 'Unauthorized',
            //     ], 403);
            // }
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
            $courseById = Course::with(['authors','technologies','reviews'])->find($id);

            if (!isset($courseById)) 
            {
                return response()->json([
                    'message' => 'No course with that id has been found'
                ], 404);
            }
            return response()->json([
                'success' => true,
                'data' => [$courseById],
                'message' => 'Course retrieving successfully'
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
                'rating' => 'numeric',
                'cover_image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
                'questions' => 'required|array',
                'author_id' => 'required',
                //Dato solo enviado por front, no se guarda en Course
                'technologies' => 'required|array',
                'technologies.*' => [
                    'required',
                    Rule::exists('technologies', 'id'), // Verifica que las tecnologías existan en la base de datos
                ],
            ];

            $validations_messages = [
                'required' => 'El campo :attribute es obligatorio.',
                'numeric' => 'El campo :attribute debe ser numerico',
                'image' => 'El campo :attribute debe ser una imagen válida.',
                'mimes' => 'El campo :attribute debe ser una imagen en formato JPEG, PNG, JPG o GIF.',
                'max' => 'El campo :attribute no debe ser mayor de 2 MB.',
                'array' => 'El campo :attribute debe ser un array',
                'technologies.required' => 'Debe seleccionar al menos una tecnología.',
                'technologies.*.required' => 'El campo tecnología es obligatorio.',
                'technologies.*.exists' => 'Una o más tecnologías seleccionadas no existen en la base de datos.',
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
                //$imagePath = $request->file('cover_image')->store('/courses', 'images');
                $image = $request->file('cover_image');
                // Generar un nombre único para la imagen
                $imageName = uniqid() . '.' . $image->getClientOriginalExtension();
                // Almacenar la imagen en la ruta deseada dentro del disco 'public'
                $imagePath = "images/courses/{$imageName}";
                Storage::disk('public')->put($imagePath, file_get_contents($image));  
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

            // Asignamos tecnologías al curso
            $technologies = $request->input('technologies');
            $createdCourse->technologies()->attach($technologies);

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
                'name' => 'string',
                'description' => 'string',
                'category' => 'string',
                'location' => 'string',
                'website' => 'string',
                'rating' => 'numeric',
                'cover_image' => 'image|mimes:jpeg,png,jpg,gif|max:2048',
                'questions' => 'string|array',
                'author_id' => 'numeric',
                'technologies' => 'required|array',
                'technologies.*' => [
                    'required',
                    Rule::exists('technologies', 'id'), // Verifica que las tecnologías existan en la base de datos
                ],
            ];
    
            $validations_messages = [
                'string' => 'El campo :attribute debe ser una cadena de texto.',
                'numeric' => 'El campo :attribute debe ser numerico',
                'image' => 'El campo :attribute debe ser una imagen válida.',
                'mimes' => 'El campo :attribute debe ser una imagen en formato JPEG, PNG, JPG o GIF.',
                'max' => 'El campo :attribute no debe ser mayor de 2 MB.',
                'array' => 'El campo :attribute debe ser un array',
                'technologies.*.required' => 'El campo tecnología es obligatorio.',
                'technologies.*.exists' => 'Una o más tecnologías seleccionadas no existen en la base de datos.',
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
                Storage::disk('public')->delete($updatedCourse->cover_image);

                $image = $request->file('cover_image');
                $imageName = uniqid() . '.' . $image->getClientOriginalExtension();
                $imagePath = "images/courses/{$imageName}";
                Storage::disk('public')->put($imagePath, file_get_contents($image));  
    
                $updatedCourse->cover_image = $imagePath;
            }
    
            $fieldsToUpdate = ['name', 'description', 'category', 'location', 'website', 'rating', 'price', 'questions', 'author_id'];

            foreach ($fieldsToUpdate as $field)
            {
                if ($request->has($field))
                {
                    $updatedCourse->{$field} = $request->input($field);
                }
            }
    
            $updatedCourse->save();

            // Asignamos tecnologías al curso
            if ($request->has('technologies')) {
                $technologies = $request->input('technologies');
                $updatedCourse->technologies()->sync($technologies);
            }

    
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

            if (isset($deletedCourse->cover_image)) 
            {
                Storage::disk('public')->delete($deletedCourse->cover_image);
            }

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

    public function getTopHighestCourses()
    {
        try 
        {
            $topCourses = Course::getCoursesWithHighestRatings(3);

            return response()->json([
                'success' => true,
                'data' => $topCourses,
                'message' => 'Top rated courses retrieved successfully'
            ], 200);

        } catch (\Exception $error)
        {
            return response()->json([
                'message' => 'An error occurred while retrieving top rated course',
                'error' => $error->getMessage()
            ], 500);
        }
    }

    public function getCourseReviewsCount($id)
    {
        try 
        {
            $course = Course::find($id);

            if (!isset($course)) 
            {
                return response()->json([
                    'message' => 'No Course with that id has been found'
                ], 404);
            }

            $reviewsCount = $course->reviews()->count();

            return response()->json([
                'success' => true,
                'data' => [
                    "course_id" => $id,
                    'reviews_count' => $reviewsCount
                ],
                'message' => 'Reviews count retrieved successfully'
            ], 200);

        } catch (\Exception $error)
        {
            return response()->json([
                'message' => 'An error occurred while retrieving reviews count',
                'error' => $error->getMessage()
            ], 500);
        }
    }
}
