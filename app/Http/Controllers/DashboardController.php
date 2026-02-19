<?php

namespace App\Http\Controllers;

use App\Jobs\CollectionSyncJob;
use App\Jobs\ProductSyncJob;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    //

    public function index()
    {
        if(!auth()->user()->product_sync) {
            // Handle the case when the user has not synced products
            ProductSyncJob::dispatch(auth()->user()->id);
        }

        if (!auth()->user()->collections_sync) {
            // Handle the case when the user has not synced collections
            CollectionSyncJob::dispatch(auth()->user()->id);
        }

        return Inertia::render('Dashboard');
    }
}
