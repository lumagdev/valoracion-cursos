<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try 
        {
            $validations = [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
            ];
            
            $validations_messages = [
                'required' => 'El campo :attribute es obligatorio.',
                'string' => 'El campo :attribute debe ser tipo string',
                'max' => 'El campo :attribute no debe ser mayor de 255 caracteres.',
                'unique' => 'El campo :attribute ya existe.',
                'min' => 'El campo :attribute debe tener un minimo de 8 caracteres.',
                'email' => 'El campo :attribute no tiene formato email.',
            ];
    
            try 
            {
                $this->validate($request, $validations, $validations_messages);
            } 
            catch (ValidationException $error) 
            {
                return response()->json([
                    'message' => 'Check the fields, there is an error',
                    'errors' => $error->errors()
                ], 422); 
            }
    
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);
    
            if ($user->roles->isEmpty()) 
            {
                $user->assignRole('common');
            }
    
            $token = $user->createToken('auth_token')->plainTextToken;
    
            return response()->json([
                'data' => $user,
                'access_token' => $token,
                'token_type' => 'Bearer',
                'success' => true
            ], 201);

        } catch (\Exception $error) 
        {
            Log::error('Error during registration: ' . $error->getMessage());
            return response()->json(['message' => 'Internal Server Error'], 500);
        }

    }

    public function login(Request $request)
    {
        try 
        {
            if (!Auth::attempt($request->only('email', 'password')))
            {
                return response()->json(['message' => 'Unauthorized'], 401);
            }
    
            $user = User::where('email', $request['email'])->firstOrFail();
        
            $token = $user->createToken('auth_token')->plainTextToken;
    
            return response()->json([
                'message' => 'Welcome ' . $user->name,
                'access_token' => $token,
                'token_type' => 'Bearer',
                'user' => [
                    'id' => $user->id,
                    'name' => $user->name,
                    'email' => $user->email,
                    'role' => $user->getRoleNames(),
                ],
            ]); 
        } catch (\Exception $error) 
        {
            Log::error('Error during login: ' . $error->getMessage());
            return response()->json(['message' => 'Internal Server Error'], 500);  
        }


    }

    public function logout(Request $request)
    {
        try 
        {
            $request->user()->currentAccessToken()->delete();

            return ['message' => 'You have successfully logged out.'];
            
        } catch (\Exception $error) {
            Log::error('Error during logout: ' . $error->getMessage());
            return response()->json(['message' => 'Internal Server Error'], 500);
        }

    }
}
