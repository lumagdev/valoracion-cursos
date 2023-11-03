<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;
use App\Models\User;
class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        User::create([
            'id' => '1',
            'name' => 'Lucía Gutiérrez',
            'email' => 'lumagc@gmail.com',
            'password' => Hash::make('lumagc2023'),
        ])->assignRole('admin');

        User::create([
            'id' => '84',
            'name' => 'Aurora Acuaviva Gutiérrez',
            'email' => 'auro@gmail.com',
            'password' => Hash::make('aurora123'),
        ])->assignRole('common');
    }
}
