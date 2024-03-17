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
            $allUsers = User::with(['reviews'])->all();
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
            $userById = User::with(['reviews','courses'])->find($id);

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
                'name' => 'string',
                'username' => 'required',
                'email' => 'required|email|unique:users',
                'password' => 'required|min:6',
            ];
    
            $validations_messages = [
                'string' => 'El campo :attributte debe ser un string',
                'required' => 'El campo :attribute es obligatorio.',
                'email' => 'El campo :attribute debe ser una dirección de correo válida.',
                'unique' => 'El campo :attribute ya existe.',
                'min' => 'El campo :attribute debe tener al menos :min caracteres.',
            ];
    
            $this->validate($request, $validations, $validations_messages);
            
            $createdUser = User::create([
                'name' => $request->name,
                'username' => $request->username,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);
    
            return response()->json([
                'success' => true,
                'data' => $createdUser,
                'message' => 'User created successfully'
            ], 201);
        
        }
        catch (ValidationException $error) 
        {
            return response()->json([
                'message' => 'Check the fields, there is an error',
                'errors' => $error->errors()
            ], 422); 
        } 
        catch(\Exception $e)
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

            if (!$updatedUser) 
            {
                return response()->json([
                    'message' => 'No user with that id has been found'
                ], 404);
            }
            
            $validations = [
                'name' => 'string',
                'username' => 'string',
                'email' => 'email|unique:users,email,' . $updatedUser->id,
                'password' => 'sometimes|min:6',
            ];

            $validations_messages = [
                'string' => 'El campo :attribute debe ser un string.',
                'email' => 'El campo :attribute debe ser una dirección de correo válida.',
                'unique' => 'El campo :attribute ya existe.',
                'min' => 'El campo :attribute debe tener al menos :min caracteres.',
            ];

            $this->validate($request, $validations, $validations_messages);

            $fieldsToUpdate = ['name','username','email','password'];

            foreach ($fieldsToUpdate as $field)
            {
                if ($request->has($field))
                {
                    if ($field === 'password' && $request->filled('password')) 
                    {
                        $updatedUser->{$field} = Hash::make($request->input($field));
                    } else 
                    {
                        $updatedUser->{$field} = $request->input($field);
                    }
                }
            }

            $updatedUser->save();

            return response()->json([
                'success' => true,
                'data' => $updatedUser,
                'message' => 'User updated successfully'
            ], 200);
        }
        catch (ValidationException $error) 
        {
            return response()->json([
                'message' => 'Check the fields, there is an error',
                'errors' => $error->errors()
            ], 422); 
        } 
        catch(\Exception $e)
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
