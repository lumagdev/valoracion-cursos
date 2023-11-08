<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        $admin = Role::create(['name' => 'admin']);
        $common = Role::create(['name' => 'common']);

        //name de la ruta normalmente
        Permission::create(['name' => 'users.allUsers'])->syncRoles($admin);
        Permission::create(['name' => 'users.userById'])->syncRoles($admin);
        Permission::create(['name' => 'users.createUser'])->syncRoles($admin);
        Permission::create(['name' => 'users.updateUser'])->syncRoles($admin);
        Permission::create(['name' => 'users.deleteUser'])->syncRoles($admin);
    }
}
