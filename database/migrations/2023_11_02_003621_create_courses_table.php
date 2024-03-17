<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('courses', function (Blueprint $table) {
            $table->id('id');
            $table->string('name', 50);
            $table->string('description', 800);
            $table->string('category', 50);
            $table->string('location', 50);
            $table->string('website', 1000);
            $table->double('rating');
            $table->string('price', 30);
            $table->string('cover_image', 800);

            $table->timestamps();
        });

        Schema::table('courses', function (Blueprint $table) {
            $table->unsignedBigInteger('author_id')->index();
            $table->foreign('author_id')->references('id')->on('authors')->cascadeOnDelete();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('courses');
    }
};
