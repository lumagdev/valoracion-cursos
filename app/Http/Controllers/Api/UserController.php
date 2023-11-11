<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use App\Models\User;
use Illuminate\Support\Facades\Hash;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Validator;
use Spatie\Permission\Models\Role;
use Spatie\Permission\Models\Permission;


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
        try 
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
        
        } catch (\Exception $e) {
            return response()->json([
                'message' => 'An error occurred while getting user',
                'error' => $e->getMessage()
            ], 500); 
        }

    }

    public function createUser(Request $request)
    {
        try 
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
        
        } catch(\Exception $e)
        {
            return response()->json([
                'message' => 'An error occurred while creating the user',
                'error' => $e->getMessage()
            ], 500);     
        }   
    }

    public function updateUser(Request $request, $id)
    {
        try 
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
        
        } catch(\Exception $e)
        {
            return response()->json([
                'message' => 'An error occurred while updating the user',
                'error' => $e->getMessage()
            ], 500);     
        }
    }

    public function deleteUser($id)
    {
        try 
        {
            $deletedUser = User::find($id);

            if (!isset($deletedUser)) 
            {
                return response()->json([
                    'message' => 'No user with that ID has been found'
                ], 404);
            }
            
            $deletedUser->delete();
    
            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ], 200);

        } catch (\Exception $e) 
        {
            return response()->json([
                'message' => 'An error occurred while deleting the user',
                'error' => $e->getMessage()
            ], 500);
        }

    }

    public function assignRole(Request $request, $id)
    {
        try {
            // Validar la solicitud
            $validator = Validator::make($request->all(), [
                'role' => 'required|exists:roles,name',
            ]);
    
            if ($validator->fails()) {
                return response()->json([
                    'message' => 'Invalid request parameters',
                    'errors' => $validator->errors(),
                ], 422);
            }
    
            // Verificar si el usuario existe
            $user = User::find($id);
    
            if (!$user) {
                return response()->json(['message' => 'The user with that id is not found.'], 404);
            }
    
            // Verificar si el rol existe
            $roleName = $request->input('role');
            $role = Role::where('name', $roleName)->first();
    
            if (!$role) {
                return response()->json(['message' => 'That role is not found.'], 404);
            }
    
            // Asignar el rol al usuario
            $user->assignRole($roleName);
    
            return response()->json([
                'message' => 'Rol asignado correctamente.',
                'user' => $user,
            ], 200);

        } catch (\Exception $e) 
        {
            return response()->json(['message' => 'An unexpected error occurred.'], 500);
        }
    }
}
