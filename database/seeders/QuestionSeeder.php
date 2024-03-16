<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class QuestionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('questions')->insert([
            'id' => '1',
            'content' => 'Pregunta Uno',
            'course_id' => '34',
        ]);
        DB::table('questions')->insert([
            'id' => '2',
            'content' => 'Pregunta Dos',
            'course_id' => '34',
        ]);
        DB::table('questions')->insert([
            'id' => '3',
            'content' => 'Pregunta Tres',
            'course_id' => '34',
        ]);
        DB::table('questions')->insert([
            'id' => '4',
            'content' => 'Pregunta Cuatro',
            'course_id' => '34',
        ]);
        DB::table('questions')->insert([
            'id' => '5',
            'content' => 'Pregunta Cinco',
            'course_id' => '34',
        ]);
    }
}
