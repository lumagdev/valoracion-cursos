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
        Schema::create('answers', function (Blueprint $table) {
            $table->id();
            $table->string('content', 300);

            $table->timestamps();
        });

        Schema::table('answers', function (Blueprint $table) {
            $table->unsignedBigInteger('review_id')->unsigned();
            $table->foreign('review_id')->references('id')->on('reviews')->onDelete('cascade');
            $table->unsignedBigInteger('question_id')->unsigned();
            $table->foreign('question_id')->references('id')->on('questions')->onDelete('cascade');
            // Cada respuesta sera de una pregunta asociada esa reseña
            $table->unique(['review_id', 'question_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('answers');
    }
};
