<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Validator;
use Illuminate\Support\Facades\Hash;
use App\Models\User;
use Illuminate\Support\Facades\Log;

class AuthController extends Controller
{
    public function register(Request $request)
    {
        try 
        {
            $validator = Validator::make($request->all(),
            [
                'name' => 'required|string|max:255',
                'email' => 'required|string|email|max:255|unique:users',
                'password' => 'required|string|min:8',
            ]);
    
            if ($validator->fails())
            {
                Log::error('Validation failed: ' . json_encode($validator->errors()));
                return response()->json(['errors' => $validator->errors()], 400);
            }
    
            $user = User::create([
                'name' => $request->name,
                'email' => $request->email,
                'password' => Hash::make($request->password),
            ]);
    
            $user->assignRole('common');
    
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
                'user' => $user
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
