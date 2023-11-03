<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class ReviewSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('reviews')->insert([
            'id' => '10',
            'user_rating' => 9.2,
            'comment' => 'Diría que es de los mejores cursos desde 0 que he encontrado y encima gratis.',
            'answers' => json_encode(['Si','Lo considero para principiantes']),
            'questionnaire' => json_encode(['Pregunta' => 'Respuesta']),
            'user_id' => '84',
            'course_id' => '34',
        ]);
    }
}
