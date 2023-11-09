<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\Technology;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Storage;
class TechnologyController extends Controller
{
    public function getAllTechnologies()
    {
        try 
        {
            $allTechnologies = Technology::all();
            return response()->json([
                'success' => true,
                'data' => $allTechnologies,
                'message' => 'Request OK'
            ], 200);

        } catch (\Exception $error) 
        {
            return response()->json([
                'message' => 'Error getting technologies',
                'error' => $error->getMessage()
            ], 500);
        }
    }

    public function getTechnologyById($id)
    {
        $technologyById = Technology::find($id);

        if (!isset($technologyById)) 
        {
            return response()->json([
                'message' => 'No technology with that id has been found'
            ], 404);
        }
        return response()->json([
            'success' => true,
            'data' => $technologyById,
            'message' => 'Request OK'
        ], 200);
    }

    public function createTechnology(Request $request)
    {
        $validations = [
            'name' => 'required',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048',
        ];

        $validations_messages = [
            'required' => 'El campo :attribute es obligatorio.',
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

        if ($request->hasFile('image')) 
        {
            $imagePath = $request->file('image')->store('/technologies', 'images'); 
        }

        $createdTechnology = new Technology;
        $createdTechnology->name = $request->input('name');
        $createdTechnology->image = $imagePath;

        $createdTechnology->save();

        return response()->json([
            'success' => true,
            'data' => $createdTechnology,
            'message' => 'Technology created successfully'
        ], 201);
    }

    public function updateTechnology(Request $request, $id)
    {

        $updatedTechnology = Technology::find($id);
        
        if (!isset($updatedTechnology)) 
        {
            return response()->json([
                'message' => 'No technology with that id has been found'
            ], 404);
        }
        
        $validations = [
            'name' => 'required',
            'image' => 'required|image|mimes:jpeg,png,jpg,gif|max:2048'
        ];

        $validations_messages = [
            'required' => 'El campo :attribute es obligatorio.',
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
    
        if ($request->hasFile('image')) 
        {
            Storage::disk('images')->delete($updatedTechnology->image);

            $imagePath = $request->file('image')->store('/technologies', 'images');
            $updatedTechnology->image = $imagePath;
        }

        $updatedTechnology->name = $request->input('name');

        $updatedTechnology->save();

        return response()->json([
            'success' => true,
            'data' => $updatedTechnology,
            'message' => 'Technology updated successfully'
        ], 201);
    }

    public function deleteTechnology($id)
    {
        $deletedTechnology = Technology::find($id);

        if (!isset($deletedTechnology)) 
        {
            return response()->json([
                'message' => 'No Technology with that id has been found'
            ], 404);
        }
        
        $deletedTechnology->delete();

        return response()->json([
            'success' => true,
            'message' => 'Technology deleted successfully'
        ], 200);
    }
}
