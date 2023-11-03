<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;

class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        DB::table('users')->insert([
            'id' => '84',
            'name' => 'Aurora Acuaviva Gutiérrez',
            'email' => 'auro@gmail.com',
            'password' => Hash::make('aurora123'),
        ]);
    }
}
