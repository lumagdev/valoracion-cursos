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
            'user_rating' => 4.2,
            'title' => 'Un curso que lo vale',
            'comment' => 'Diría que es de los mejores cursos desde 0 que he encontrado y encima gratis.',
            'user_id' => '84',
            'course_id' => '34',
        ]);
    }
}
