<?php

namespace App\Jobs;

use App\Models\User;
use App\Models\Product;
use App\Models\ProductVariant;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class ProductSyncJob implements ShouldQueue
{
    use Queueable;

    protected $shopId;

    /**
     * Create a new job instance.
     */
    public function __construct(int $shopId)
    {
        $this->shopId = $shopId;
    }

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $shop = User::find($this->shopId);

        if (!$shop) {
            Log::error("ProductSyncJob: Shop not found for ID {$this->shopId}");
            return;
        }

        $cursor = null;
        $hasNextPage = true;

        while ($hasNextPage) {
            $query = $this->buildGraphQLQuery($cursor);
            $response = $shop->api()->graph($query);
            $data = $response['body']['data']['products'] ?? null;

            if (!$data) {
                Log::error('ProductSyncJob: No product data returned from Shopify.');
                break;
            }

            foreach ($data['edges'] as $edge) {
                $node = $edge['node'];
                $shopifyProductId = str_replace('gid://shopify/Product/', '', $node['id']);

                // Get first image URL
                $image = $node['images']['edges'][0]['node']['src'] ?? null;

                // Get first variant price and total inventory
                $firstVariant = $node['variants']['edges'][0]['node'] ?? null;
                $price = $firstVariant ? (float) $firstVariant['price'] : 0;

                $product = Product::updateOrCreate(
                    ['shopify_product_id' => $shopifyProductId],
                    [
                        'title'           => $node['title'],
                        'image'           => $image,
                        'total_inventory' => $node['totalInventory'] ?? 0,
                        'price'           => $price,
                    ]
                );

                // Sync variants
                foreach ($node['variants']['edges'] as $variantEdge) {
                    $variantNode = $variantEdge['node'];
                    $shopifyVariantId = str_replace('gid://shopify/ProductVariant/', '', $variantNode['id']);

                    ProductVariant::updateOrCreate(
                        ['shopify_variant_id' => $shopifyVariantId],
                        [
                            'product_id'         => $product->id,
                            'title'              => $variantNode['title'],
                            'price'              => (float) $variantNode['price'],
                            'inventory_quantity'  => $variantNode['inventoryQuantity'] ?? 0,
                        ]
                    );
                }
            }

            $hasNextPage = $data['pageInfo']['hasNextPage'];
            $cursor = $data['edges'][count($data['edges']) - 1]['cursor'] ?? null;
        }

        Log::info('ProductSyncJob: Product sync completed for shop ' . $shop->name);
    }

    /**
     * Build the Shopify GraphQL query for products.
     */
    private function buildGraphQLQuery(?string $cursor): string
    {
        $after = $cursor ? ', after: "' . $cursor . '"' : '';

        return <<<GRAPHQL
        {
            products(first: 250{$after}) {
                edges {
                    cursor
                    node {
                        id
                        title
                        totalInventory
                        images(first: 1) {
                            edges {
                                node {
                                    src
                                }
                            }
                        }
                        variants(first: 100) {
                            edges {
                                node {
                                    id
                                    title
                                    price
                                    inventoryQuantity
                                }
                            }
                        }
                    }
                }
                pageInfo {
                    hasNextPage
                }
            }
        }
        GRAPHQL;
    }
}
