<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class AnswerSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('answers')->insert([
            'id' => '1',
            'content' => 'Pregunta Uno',
            'review_id' => '10',
            'question_id' => '1',
        ]);
        DB::table('answers')->insert([
            'id' => '2',
            'content' => 'Pregunta Dos',
            'review_id' => '10',
            'question_id' => '2',
        ]);
        DB::table('answers')->insert([
            'id' => '3',
            'content' => 'Pregunta Tres',
            'review_id' => '10',
            'question_id' => '3',
        ]);
        DB::table('answers')->insert([
            'id' => '4',
            'content' => 'Pregunta Cuatro',
            'review_id' => '10',
            'question_id' => '4',
        ]);
        DB::table('answers')->insert([
            'id' => '5',
            'content' => 'Pregunta Cinco',
            'review_id' => '10',
            'question_id' => '5',
        ]);
    }
}
