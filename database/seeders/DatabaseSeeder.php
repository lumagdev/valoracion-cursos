<?php

namespace Database\Seeders;

// use Illuminate\Database\Console\Seeds\WithoutModelEvents;

use Illuminate\Database\Seeder;
use Database\Seeders\UserSeeder;
use Database\Seeders\AuthorSeeder;
use Database\Seeders\CourseSeeder;
use Database\Seeders\TechnologySeeder;
use Database\Seeders\ReviewSeeder;
use Database\Seeders\CourseTechnologySeeder;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $this->call([
            UserSeeder::class,
            AuthorSeeder::class,
            TechnologySeeder::class,
            CourseSeeder::class,
            ReviewSeeder::class,
            CourseTechnologySeeder::class,
        ]);
    }
}
