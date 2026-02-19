<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Product extends Model
{
    protected $fillable = [
        'shopify_product_id',
        'title',
        'image',
        'total_inventory',
        'price'
    ];

    public function variants()
    {
        return $this->hasMany(ProductVariant::class);
    }
}
