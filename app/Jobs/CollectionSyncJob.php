<?php

namespace App\Jobs;

use App\Models\User;
use App\Models\Collection;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Log;

class CollectionSyncJob implements ShouldQueue
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
            Log::error("CollectionSyncJob: Shop not found for ID {$this->shopId}");
            return;
        }

        $cursor = null;
        $hasNextPage = true;

        while ($hasNextPage) {
            $query = $this->buildGraphQLQuery($cursor);
            $response = $shop->api()->graph($query);
            $data = $response['body']['data']['collections'] ?? null;

            if (!$data) {
                Log::error('CollectionSyncJob: No collection data returned from Shopify.');
                break;
            }

            foreach ($data['edges'] as $edge) {
                $node = $edge['node'];
                $shopifyCollectionId = str_replace('gid://shopify/Collection/', '', $node['id']);

                // Get image URL
                $image = $node['image']['src'] ?? null;

                // Get products count
                $productsCount = $node['productsCount']['count'] ?? 0;

                Collection::updateOrCreate(
                    ['shopify_collection_id' => $shopifyCollectionId,
                    'user_id' => $shop->id
                    ],
                    [
                        'title'          => $node['title'],
                        'description'    => $node['description'] ?? null,
                        'handle'         => $node['handle'],
                        'image'          => $image,
                        'products_count' => $productsCount,
                    ]
                );
            }

            $hasNextPage = $data['pageInfo']['hasNextPage'];
            $cursor = $data['edges'][count($data['edges']) - 1]['cursor'] ?? null;
        }

        Log::info('CollectionSyncJob: Collection sync completed for shop ' . $shop->name);
    }

    /**
     * Build the Shopify GraphQL query for collections.
     */
    private function buildGraphQLQuery(?string $cursor): string
    {
        $after = $cursor ? ', after: "' . $cursor . '"' : '';

        return <<<GRAPHQL
        {
            collections(first: 250{$after}) {
                edges {
                    cursor
                    node {
                        id
                        title
                        description
                        handle
                        image {
                            src
                        }
                        productsCount {
                            count
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
