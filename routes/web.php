<?php

use Illuminate\Support\Facades\Route;
use Inertia\Inertia;
use App\Http\Controllers\DashboardController;
use App\Http\Controllers\ProductController;
use App\Http\Controllers\ShopifyProductSyncController;


Route::group(['middleware' => ['verify.embedded', 'verify.shopify']], function () {

    Route::get('/', [DashboardController::class, 'index'])->name('home');
    Route::get('/products', [ProductController::class, 'index'])->name('products.index');

    
    });
    
    // Route::post('/sync-products', [ShopifyProductSyncController::class, 'sync'])->name('products.sync');

require __DIR__ . '/auth.php';
