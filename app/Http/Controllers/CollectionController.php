<?php

namespace App\Http\Controllers;

use App\Models\Collection;
use Illuminate\Http\Request;

// class CollectionController extends Controller

// {
//     public function index(Request $request)
//     {
//         $collections = Collection::with('user')->cursorPaginate(20);
//         return response()->json($collections);
//     }


// }

class CollectionController extends Controller
{
    public function index(Request $request)
    {
        $shop = $request->user();

        $collections = Collection::where('user_id', $shop->id)
            ->select('id', 'title')
            ->orderBy('title')
            ->get();

        return response()->json([
            'success' => true,
            'data' => $collections,
        ]);
    }
}