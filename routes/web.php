<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;

Route::group(['middleware' => ['verify.embedded', 'verify.shopify']], function () {

    Route::get('/', function(){

        return Inertia::render('Dashboard');
    })->name('home');

});

require __DIR__ . '/auth.php';
