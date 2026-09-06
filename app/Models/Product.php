<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use App\Models\StockMovement;

class Product extends Model
{
    protected $fillable = ['category_id', 'name', 'sku', 'purchase_price', 'selling_price', 'stock'];

    public function category()
    {
        return $this->belongsTo(Category::class);
    }

    public function transactionItems()
    {
        return $this->hasMany(TransactionItem::class);
    }
    public function stockMovements()
    {   
    return $this->hasMany(StockMovement::class);
    }
}
