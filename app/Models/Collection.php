<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Collection extends Model

{
    protected $fillable = [
        'user_id',
        'shopify_collection_id',
        'title',
        'description',
        'image',
        'handle',
        'products_count',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}

 

