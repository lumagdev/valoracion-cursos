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
                $photoPath = $request->file('photo')->store('/authors', 'images');
                // $fileNameWithExtension = $request->file('photo')->getClientOriginalName();
                // $fileName = pathinfo($fileNameWithExtension, PATHINFO_FILENAME);
                // $FileExtension = $request->file('photo')->getClientOriginalExtension();
                // $fileNameToStore = $fileName.'_'.time().'.'.$FileExtension;
                // Storage::disk('images')->put('/authors/'.$fileNameToStore, File::get($request->file('photo')) );  
            }

            $createdAuthor = new Author;
            $createdAuthor->name = $request->input('name');
            $createdAuthor->website = $request->input('website');
            $createdAuthor->author_rating = $request->input('author_rating');
            $createdAuthor->photo = $photoPath;

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
                Storage::disk('images')->delete($updatedAuthor->photo);
                // Actualizamos la nueva imagen
                $photoPath = $request->file('photo')->store('/authors', 'images');
                $updatedAuthor->photo = $photoPath;
                
                // $fileNameWithExtension = $request->file('photo')->getClientOriginalName();
                // $fileName = pathinfo($fileNameWithExtension, PATHINFO_FILENAME);
                // $FileExtension = $request->file('photo')->getClientOriginalExtension();
                // $fileNameToStore = $fileName.'_'.time().'.'.$FileExtension;
                // Storage::disk('images')->put('/authors/'.$fileNameToStore, File::get($request->file('photo')) );
                // $updatedAuthor->photo = $fileNameToStore;
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