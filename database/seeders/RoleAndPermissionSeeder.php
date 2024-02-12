<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Spatie\Permission\Models\Permission;
use Spatie\Permission\Models\Role;

class RoleAndPermissionSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Crear los roles
        $adminRole = Role::create(['name' => 'admin']);
        $commonRole = Role::create(['name' => 'common']);

        // // Crear permisos
        // $reviewCrudPermission = Permission::create(['name' => 'review-crud']);
        // $editOwnUserPermission = Permission::create(['name' => 'edit-own-user']);

        // // Asignar permisos a roles
        // $commonRole->givePermissionTo('review-crud');
        // $commonRole->givePermissionTo('edit-own-user');
        // $adminRole->givePermissionTo(['review-crud', 'edit-own-user']);
    }
}
