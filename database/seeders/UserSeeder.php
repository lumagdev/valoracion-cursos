<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\Hash;
use Illuminate\Database\Seeder;
use App\Models\User;
use Spatie\Permission\Models\Role;
class UserSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Obtener los roles existentes
        $adminRole = Role::findByName('admin');
        $commonRole = Role::findByName('common');

        //Creando un usuario admin
        $adminUser = User::create([
            'id' => '1',
            'name' => 'Lucía Gutiérrez',
            'email' => 'lumagc@gmail.com',
            'password' => Hash::make('lumagc2023'),
        ]);

        // Asignar el rol 'common' al usuario común
        $adminUser->assignRole($adminRole);

        $commonUser = User::create([
            'id' => '84',
            'name' => 'Aurora Acuaviva Gutiérrez',
            'email' => 'auro@gmail.com',
            'password' => Hash::make('aurora123'),
        ]);
        
        // Asignar el rol 'common' al usuario común
        $commonUser->assignRole($commonRole);
    }
}
