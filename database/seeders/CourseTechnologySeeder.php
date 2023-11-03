<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class CourseTechnologySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('courses_technologies')->insert([
            'course_id' => '34',
            'technology_id' => '99'
        ]);
        DB::table('courses_technologies')->insert([
            'course_id' => '34',
            'technology_id' => '78'
        ]);
    }
}
