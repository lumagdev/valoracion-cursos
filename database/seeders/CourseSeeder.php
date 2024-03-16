<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CourseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('courses')->insert([
            'id' => '34',
            'name' => 'Backend en Python',
            'description' => 'Este es un nuevo curso actualizado que te enseñara como iniciar tus primeros pasos hasta crear tu primer backend en python.',
            'category' => 'Backend',
            'location' => 'Youtube',
            'website' => 'https://www.youtube.com/watch?v=Kp4Mvapo5kc&list=PLNdFk2_brsRdgQXLIlKBXQDeRf3qvXVU_&ab_channel=MoureDevbyBraisMoure',
            'rating' => 4.5,
            'price' => 'Gratis',
            'cover_image' => 'imagen',
            'author_id' => '56'
        ]);
    }
}
