<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use App\Models\Author;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Facades\File;
class AuthorController extends Controller
{
    public function getAllAuthors()
    {
        try 
        {
            $allAuthors = Author::all();
            return response()->json([
                'success' => true,
                'data' => $allAuthors,
                'message' => 'Request OK'
            ], 200);

        } catch (\Exception $error) 
        {
            return response()->json([
                'message' => 'Error getting authors',
                'error' => $error->getMessage()
            ], 500);
        }
    }

    public function getAuthorById($id)
    {
        try
        {
            $authorById = Author::find($id);

            if (!isset($authorById)) 
            {
                return response()->json([
                    'message' => 'No author with that id has been found'
                ], 404);
            }
            return response()->json([
                'success' => true,
                'data' => $authorById,
                'message' => 'Request OK'
            ], 200);
        }
        catch(\Exception $error)
        {
            return response()->json([
                'message' => 'An error occurred while getting the author',
                'error' => $error->getMessage()
            ], 500); 
        }
    }

    public function createAuthor(Request $request)
    {
        try
        {
            $validations = [
                'name' => 'required',
                'website' => 'required',
                'author_rating' => 'numeric',
                'photo' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
            ];

            $validations_messages = [
                'required' => 'El campo :attribute es obligatorio.',
                'numeric' => 'El campo :attribute debe ser numerico',
                'min' => 'El campo :attribute debe tener al menos :min caracteres.',
                'image' => 'El campo :attribute debe ser una imagen válida.',
                'mimes' => 'El campo :attribute debe ser una imagen en formato JPEG, PNG, JPG o GIF.',
                'max' => 'El campo :attribute no debe ser mayor de 2 MB.'
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

            if ($request->hasFile('photo')) 
            {
                //$photoPath = $request->file('photo')->store('/authors', 'images');

                $image = $request->file('photo');
                // Generar un nombre único para la imagen
                $imageName = uniqid() . '.' . $image->getClientOriginalExtension();
                // Almacenar la imagen en la ruta deseada dentro del disco 'public'
                $imagePath = "images/authors/{$imageName}";
                Storage::disk('public')->put($imagePath, file_get_contents($image));  
            }

            $createdAuthor = new Author;
            $createdAuthor->name = $request->input('name');
            $createdAuthor->website = $request->input('website');
            $createdAuthor->author_rating = $request->input('author_rating');
            $createdAuthor->photo = $imagePath;

            $createdAuthor->save();

            return response()->json([
                'success' => true,
                'data' => $createdAuthor,
                'message' => 'Author created successfully'
            ], 201);
        }
        catch(\Exception $error)
        {
            return response()->json([
                'message' => 'An error occurred while creating the author',
                'error' => $error->getMessage()
            ], 500); 
        }
    }

    public function updateAuthor(Request $request, $id)
    {
        try
        {
            $updatedAuthor = Author::find($id);
            
            if (!isset($updatedAuthor)) 
            {
                return response()->json([
                    'message' => 'No author with that id has been found'
                ], 404);
            }
            
            $validations = [
                'name' => 'required',
                'website' => 'required',
                'author_rating' => 'numeric',
                'photo' => 'image|mimes:jpeg,png,jpg,gif|max:2048'
            ];

            $validations_messages = [
                'required' => 'El campo :attribute es obligatorio.',
                'numeric' => 'El campo :attribute debe ser numerico',
                'min' => 'El campo :attribute debe tener al menos :min caracteres.',
                'image' => 'El campo :attribute debe ser una imagen válida.',
                'mimes' => 'El campo :attribute debe ser una imagen en formato JPEG, PNG, JPG o GIF.',
                'max' => 'El campo :attribute no debe ser mayor de 2 MB.'
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
        
            if ($request->hasFile('photo')) 
            {
                // Si hay foto nueva debemos recuperar la vieja y eliminarla
                Storage::disk('public')->delete($updatedAuthor->photo);
                // Actualizamos la nueva imagen
                $image = $request->file('photo');
                $imageName = uniqid() . '.' . $image->getClientOriginalExtension();
                $imagePath = "images/authors/{$imageName}";
                Storage::disk('public')->put($imagePath, file_get_contents($image));  
    
                $updatedAuthor->photo = $imagePath;
                
            }
            //Actualizamos el autor
            $updatedAuthor->name = $request->input('name');
            $updatedAuthor->website = $request->input('website');
            $updatedAuthor->author_rating = $request->input('author_rating');

            $updatedAuthor->save();

            return response()->json([
                'success' => true,
                'data' => $updatedAuthor,
                'message' => 'Author updated successfully'
            ], 201);
        }
        catch(\Exception $error)
        {
            return response()->json([
                'message' => 'An error occurred while updating the author',
                'error' => $error->getMessage()
            ], 500); 
        }
    }

    public function deleteAuthor($id)
    {
        try
        {
            $deletedAuthor = Author::find($id);

            if (isset($deletedAuthor->photo)) 
            {
                Storage::disk('public')->delete($deletedAuthor->photo);
            }

            if (!isset($deletedAuthor)) 
            {
                return response()->json([
                    'message' => 'No author with that id has been found'
                ], 404);
            }
            
            $deletedAuthor->delete();

            return response()->json([
                'success' => true,
                'message' => 'Author deleted successfully'
            ], 200);
        }
        catch(\Exception $error)
        {
            return response()->json([
                'message' => 'An error occurred while deleting the author',
                'error' => $error->getMessage()
            ], 500); 
        }
    }
}