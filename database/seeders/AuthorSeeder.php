<?php

namespace Database\Seeders;

use App\Models\Author;
use Illuminate\Support\Facades\DB;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class AuthorSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('authors')->insert([
            'id' => '56',
            'name' => 'Brais Moure',
            'website' => 'https://mouredev.com/',
            'author_rating' => 8.5,
            'photo' => 'foto autor'
        ]);
    }
}
