<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Validator;
use App\Models\User;

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

        } catch (\Throwable $error) 
        {
            return response()->json([
                'error' => $error->getMessage()
            ], 500);
        }
    }

    public function getUserById($id)
    {
        try 
        {
            $userById = User::find($id);
            return response()->json([
                'success' => true,
                'data' => $userById,
                'message' => 'Request OK'
            ], 200);

        } catch (\Throwable $error) 
        {
            return response()->json([
                'error' => $error->getMessage()
            ], 500);
        }
    }

    public function createUser(Request $request)
    {
        try 
        {
            $newUser = $request->all();
   
            $validator = Validator::make($newUser, [
                'name' => 'required|string', 
                'email' => 'required|string', 
                'password' => 'required|string'
            ]);
       
            if($validator->fails()){
                return response()->json([
                    'Check the fields, there is an error' => $validator->errors()
                ]);         
            }

            $createdUser = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => $request->password,
            ]);

            return response()->json([
                'success' => true,
                'data' => $createdUser,
                'message' => 'User created successfully'
            ], 201);

        } catch (\Throwable $error) 
        {
            return response()->json([
                'error' => $error->getMessage()
            ], 500);
        }
    }

    public function updateUser(Request $request, $id)
    {
        try 
        {
            //$editUser = $request->all();
   
            $validator = Validator::make($request->all(), [
                'name' => 'required|string', 
                'email' => 'required|string', 
                'password' => 'required|string'
            ]);
       
            if($validator->fails()){
                return response()->json([
                    'Check the fields, there is an error' => $validator->errors()
                ]);       
            }

            $updatedUser = User::find($id);
            $updatedUser->name = $request->name;
            $updatedUser->email = $request->email;
            $updatedUser->password = $request->password;
            $updatedUser->save();

            return response()->json([
                'success' => true,
                'data' => $updatedUser,
                'message' => 'User updated successfully'
            ], 200);

        } catch (\Throwable $error) 
        {
            return response()->json([
                'error' => $error->getMessage()
            ], 500);
        }
    }

    public function deleteUser($id)
    {
        try 
        {
            $deletedUser = User::find($id);
            $deletedUser->delete();

            return response()->json([
                'success' => true,
                'message' => 'User deleted successfully'
            ], 204);
        } catch (\Throwable $error) 
        {
            return response()->json([
                'error' => $error->getMessage()
            ], 500);
        }

    }
}
