<?php

namespace Database\Seeders;

use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class TechnologySeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('technologies')->insert([
            'id' => '99',
            'name' => 'Python',
            'image' => 'imagen tecnologia',
        ]);
        DB::table('technologies')->insert([
            'id' => '78',
            'name' => 'Git',
            'image' => '',
        ]);
    }
}
