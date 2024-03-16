<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Validation\ValidationException;
use Illuminate\Support\Facades\Mail;
use App\Mail\ContactFormSubmitted;

class ContactController extends Controller
{
    public function sendContactForm(Request $request)
    {
        try 
        {
            $validations = [
                'email' => 'required|email',
                'message' => 'required|string',
            ];

            $validations_messages = [
                'required' => 'El campo :attribute es obligatorio.',
                'email' => 'El campo :attribute debe ser un email válido',
                'string' => 'El campo :attribute debe ser un string'
            ];

            $this->validate($request, $validations, $validations_messages);

            // $email = $request->input('email');
            // $message = $request->input('message');
            //Mail::to('lual.30xd@gmail.com')->send(new ContactFormSubmittted($email, $message));

            return response()->json([
                'success' => true,
                'message' => 'Contact Form has been sent successfully'
            ], 201);
        } 
        catch (ValidationException $error)
        {
            return response()->json([
                'message' => 'Check the fields, there is an error',
                'errors' => $error->errors()
            ], 422); 
        }
        catch(\Exception $error)
        {
            return response()->json([
                'message' => 'An error occurred while sendind contact',
                'error' => $error->getMessage()
            ], 500); 
        }
    }
}
