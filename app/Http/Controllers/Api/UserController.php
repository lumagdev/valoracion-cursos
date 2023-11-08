<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;


class UserController extends Controller
{
    public function getAllUsers()
    {
        try 
        {
            $allUsers = User::all();
            return response()->json([
                'success' => true,
                'data' => $allUsers,
                'message' => 'Request OK'
            ], 200);

        } catch (\Exception $error) 
        {
            return response()->json([
                'message' => 'Error getting users',
                'error' => $error->getMessage()
            ], 500);
        }
    }

    public function getUserById($id)
    {
        $userById = User::find($id);

        if (!isset($userById)) 
        {
            return response()->json([
                'message' => 'No user with that id has been found'
            ], 404);
        }

        return response()->json([
            'success' => true,
            'data' => $userById,
            'message' => 'Request OK'
        ], 200);
    }

    public function createUser(Request $request)
    {
        $validations = [
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ];

        $validations_messages = [
            'required' => 'El campo :attribute es obligatorio.',
            'email' => 'El campo :attribute debe ser una dirección de correo válida.',
            'unique' => 'El campo :attribute ya existe.',
            'min' => 'El campo :attribute debe tener al menos :min caracteres.',
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
        
        $createdUser = User::create([
            'name' => $request->name,
            'email' => $request->email,
            'password' => Hash::make($request->password),
        ]);

        return response()->json([
            'success' => true,
            'data' => $createdUser,
            'message' => 'User created successfully'
        ], 201);
    }

    public function updateUser(Request $request, $id)
    {
        $updatedUser = User::find($id);

        if (!isset($updatedUser)) 
        {
            return response()->json([
                'message' => 'No user with that id has been found'
            ], 404);
        }
        
        $validations = [
            'name' => 'required',
            'email' => 'required|email|unique:users',
            'password' => 'required|min:6',
        ];

        $validations_messages = [
            'required' => 'El campo :attribute es obligatorio.',
            'email' => 'El campo :attribute debe ser una dirección de correo válida.',
            'unique' => 'El campo :attribute ya existe.',
            'min' => 'El campo :attribute debe tener al menos :min caracteres.',
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

        $updatedUser->name = $request->input('name');
        $updatedUser->email = $request->input('email');
        $updatedUser->password = Hash::make($request->input('password'));
        
        $updatedUser->save();

        return response()->json([
            'success' => true,
            'data' => $updatedUser,
            'message' => 'User updated successfully'
        ], 200);
    }

    public function deleteUser($id)
    {
        $deletedUser = User::find($id);

        if (!isset($deletedUser)) 
        {
            return response()->json([
                'message' => 'No user with that id has been found'
            ], 404);
        }
        
        $deletedUser->delete();

        return response()->json([
            'success' => true,
            'message' => 'User deleted successfully'
        ], 200);
    }
}
