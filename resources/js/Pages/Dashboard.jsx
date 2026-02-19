import { useState, useEffect, useCallback } from 'react';
import {
    Box,
    Button,
    Page,
    Text,
    Card,
    BlockStack,
    InlineStack,
    ResourceList,
    ResourceItem,
    Avatar,
    Thumbnail,
    Badge,
    Spinner,
    Banner,
    Pagination,
    Select,
    LegacyCard,
    IndexFilters,
    IndexTable,
    useSetIndexFiltersMode,
    useIndexResourceState,
    ChoiceList,
    TextField,
    useBreakpoints,
    RangeSlider,
} from '@shopify/polaris';
import { ImageIcon, DeleteIcon, ViewIcon } from '@shopify/polaris-icons';
import { usePage } from '@inertiajs/react';

export default function Dashboard() {
    const { query } = usePage().props.ziggy;

    const [products, setProducts] = useState([]);
    const [selectedItems, setSelectedItems] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [nextPageUrl, setNextPageUrl] = useState(null);
    const [prevPageUrl, setPrevPageUrl] = useState(null);
    const [pageNumber, setPageNumber] = useState(1);

    // IndexTable products state
    const [tableProducts, setTableProducts] = useState([]);
    const [tableLoading, setTableLoading] = useState(false);
    const [tableNextPageUrl, setTableNextPageUrl] = useState(null);
    const [tablePrevPageUrl, setTablePrevPageUrl] = useState(null);
    const [tablePageNumber, setTablePageNumber] = useState(1);
    const [viewProduct, setViewProduct] = useState(null);
    // const [collections, setCollections] = useState([]);
    // const [selectedCollection, setSelectedCollection] = useState('');
    // const [collectionsLoading, setCollectionsLoading] = useState(false);

    // const fetchCollections = useCallback(async () => {
    //     setCollectionsLoading(true);
    //     try {
    //         const response = await fetch(route('collections.index', query), {
    //             method: 'GET',
    //             headers: {
    //                 'Content-Type': 'application/json',
    //                 'ngrok-skip-browser-warning': 'true',
    //             },
    //         });

    //         if (!response.ok) {
    //             throw new Error('Network response was not ok');
    //         }

    //         const result = await response.json();
    //         if (result.success && Array.isArray(result.data)) {
    //             setCollections(result.data);
    //         }
    //     } catch (err) {
    //         console.error('Failed to fetch collections:', err);
    //     } finally {
    //         setCollectionsLoading(false);
    //     }
    // }, [query]);

    // useEffect(() => {
    //     fetchCollections();
    // }, [fetchCollections]);

    // const handleCollectionChange = useCallback(
    //     (value) => setSelectedCollection(value),
    //     [],
    // );

    // const collectionOptions = [
    //     { label: 'Select a collection', value: '' },
    //     ...collections.map((col) => ({
    //         label: col.title,
    //         value: String(col.id),
    //     })),
    // ];



    const sleep = (ms) =>
        new Promise((resolve) => setTimeout(resolve, ms));
    const [itemStrings, setItemStrings] = useState([
        'All',
        'Active',
        'Draft',
        // 'Unpaid',
        // 'Open',
        // 'Closed',
        // 'Local delivery',
        // 'Local pickup',
    ]);
    const deleteView = (index) => {
        const newItemStrings = [...itemStrings];
        newItemStrings.splice(index, 1);
        setItemStrings(newItemStrings);
        setSelected(0);
    };

    const duplicateView = async (name) => {
        setItemStrings([...itemStrings, name]);
        setSelected(itemStrings.length);
        await sleep(1);
        return true;
    };

    const tabs = itemStrings.map((item, index) => ({
        content: item,
        index,
        onAction: () => { },
        id: `${item}-${index}`,
        isLocked: index === 0,
        actions:
            index === 0
                ? []
                : [
                    {
                        type: 'rename',
                        onAction: () => { },
                        onPrimaryAction: async (value) => {
                            const newItemsStrings = tabs.map((item, idx) => {
                                if (idx === index) {
                                    return value;
                                }
                                return item.content;
                            });
                            await sleep(1);
                            setItemStrings(newItemsStrings);
                            return true;
                        },
                    },
                    {
                        type: 'duplicate',
                        onPrimaryAction: async (value) => {
                            await sleep(1);
                            duplicateView(value);
                            return true;
                        },
                    },
                    {
                        type: 'edit',
                    },
                    {
                        type: 'delete',
                        onPrimaryAction: async () => {
                            await sleep(1);
                            deleteView(index);
                            return true;
                        },
                    },
                ],
    }));
    const [selected, setSelected] = useState(0);
    const onCreateNewView = async (value) => {
        await sleep(500);
        setItemStrings([...itemStrings, value]);
        setSelected(itemStrings.length);
        return true;
    };
    const sortOptions = [
        { label: 'Order', value: 'order asc', directionLabel: 'Ascending' },
        { label: 'Order', value: 'order desc', directionLabel: 'Descending' },
        { label: 'Customer', value: 'customer asc', directionLabel: 'A-Z' },
        { label: 'Customer', value: 'customer desc', directionLabel: 'Z-A' },
        { label: 'Date', value: 'date asc', directionLabel: 'A-Z' },
        { label: 'Date', value: 'date desc', directionLabel: 'Z-A' },
        { label: 'Total', value: 'total asc', directionLabel: 'Ascending' },
        { label: 'Total', value: 'total desc', directionLabel: 'Descending' },
    ];
    const [sortSelected, setSortSelected] = useState(['order asc']);
    const { mode, setMode } = useSetIndexFiltersMode();
    const onHandleCancel = () => { };

    const onHandleSave = async () => {
        await sleep(1);
        return true;
    };

    const primaryAction =
        selected === 0
            ? {
                type: 'save-as',
                onAction: onCreateNewView,
                disabled: false,
                loading: false,
            }
            : {
                type: 'save',
                onAction: onHandleSave,
                disabled: false,
                loading: false,
            };
    const [accountStatus, setAccountStatus] = useState(
        undefined,
    );
    const [moneySpent, setMoneySpent] = useState(
        undefined,
    );
    const [taggedWith, setTaggedWith] = useState('');
    const [queryValue, setQueryValue] = useState('');

    const handleAccountStatusChange = useCallback(
        (value) => setAccountStatus(value),
        [],
    );
    const handleMoneySpentChange = useCallback(
        (value) => setMoneySpent(value),
        [],
    );
    const handleTaggedWithChange = useCallback(
        (value) => setTaggedWith(value),
        [],
    );
    const handleFiltersQueryChange = useCallback(
        (value) => setQueryValue(value),
        [],
    );
    const handleAccountStatusRemove = useCallback(
        () => setAccountStatus(undefined),
        [],
    );
    const handleMoneySpentRemove = useCallback(
        () => setMoneySpent(undefined),
        [],
    );
    const handleTaggedWithRemove = useCallback(() => setTaggedWith(''), []);
    const handleQueryValueRemove = useCallback(() => setQueryValue(''), []);
    const handleFiltersClearAll = useCallback(() => {
        handleAccountStatusRemove();
        handleMoneySpentRemove();
        handleTaggedWithRemove();
        handleQueryValueRemove();
    }, [
        handleAccountStatusRemove,
        handleMoneySpentRemove,
        handleQueryValueRemove,
        handleTaggedWithRemove,
    ]);

    const filters = [
        {
            key: 'accountStatus',
            label: 'Account status',
            filter: (
                <ChoiceList
                    title="Account status"
                    titleHidden
                    choices={[
                        { label: 'Enabled', value: 'enabled' },
                        { label: 'Not invited', value: 'not invited' },
                        { label: 'Invited', value: 'invited' },
                        { label: 'Declined', value: 'declined' },
                    ]}
                    selected={accountStatus || []}
                    onChange={handleAccountStatusChange}
                    allowMultiple
                />
            ),
            shortcut: true,
        },
        {
            key: 'taggedWith',
            label: 'Tagged with',
            filter: (
                <TextField
                    label="Tagged with"
                    value={taggedWith}
                    onChange={handleTaggedWithChange}
                    autoComplete="off"
                    labelHidden
                />
            ),
            shortcut: true,
        },
        {
            key: 'moneySpent',
            label: 'Money spent',
            filter: (
                <RangeSlider
                    label="Money spent is between"
                    labelHidden
                    value={moneySpent || [0, 500]}
                    prefix="$"
                    output
                    min={0}
                    max={2000}
                    step={1}
                    onChange={handleMoneySpentChange}
                />
            ),
        },
    ];

    const appliedFilters = [];
    if (accountStatus && !isEmpty(accountStatus)) {
        const key = 'accountStatus';
        appliedFilters.push({
            key,
            label: disambiguateLabel(key, accountStatus),
            onRemove: handleAccountStatusRemove,
        });
    }
    if (moneySpent) {
        const key = 'moneySpent';
        appliedFilters.push({
            key,
            label: disambiguateLabel(key, moneySpent),
            onRemove: handleMoneySpentRemove,
        });
    }
    if (!isEmpty(taggedWith)) {
        const key = 'taggedWith';
        appliedFilters.push({
            key,
            label: disambiguateLabel(key, taggedWith),
            onRemove: handleTaggedWithRemove,
        });
    }

    // Fetch products for IndexTable
    const fetchTableProducts = useCallback(async (url = null, direction = 'next') => {
        setTableLoading(true);
        try {
            const fetchUrl = url || route('products.index', query);
            const response = await fetch(fetchUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setTableProducts(Array.isArray(data.data) ? data.data : []);
            setTableNextPageUrl(data.next_page_url || null);
            setTablePrevPageUrl(data.prev_page_url || null);

            if (!url) {
                setTablePageNumber(1);
            } else if (direction === 'next') {
                setTablePageNumber((prev) => prev + 1);
            } else {
                setTablePageNumber((prev) => Math.max(1, prev - 1));
            }
        } catch (err) {
            console.error('Failed to fetch table products:', err);
        } finally {
            setTableLoading(false);
        }
    }, [query]);

    // Fetch on mount
    useEffect(() => {
        fetchTableProducts();
    }, [fetchTableProducts]);

    const handleTableNextPage = useCallback(() => {
        if (tableNextPageUrl) {
            fetchTableProducts(tableNextPageUrl, 'next');
        }
    }, [tableNextPageUrl, fetchTableProducts]);

    const handleTablePreviousPage = useCallback(() => {
        if (tablePrevPageUrl) {
            fetchTableProducts(tablePrevPageUrl, 'prev');
        }
    }, [tablePrevPageUrl, fetchTableProducts]);

    const resourceName = {
        singular: 'product',
        plural: 'products',
    };

    const { selectedResources, allResourcesSelected, handleSelectionChange } =
        useIndexResourceState(tableProducts);

    const rowMarkup = tableProducts.map(
        (product, index) => (
            <IndexTable.Row
                id={String(product.id)}
                key={product.id}
                selected={selectedResources.includes(String(product.id))}
                position={index}
            >
                <IndexTable.Cell>
                    <Text variant="bodyMd" fontWeight="bold" as="span">
                        {product.shopify_product_id}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Thumbnail
                        source={product.image || ImageIcon}
                        alt={product.title}
                        size="small"
                    />
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text variant="bodyMd" as="span">
                        {product.title}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as="span" numeric>
                        ${product.price || '0.00'}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Text as="span">
                        {product.total_inventory ?? 0}
                    </Text>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <Badge tone={product.total_inventory > 0 ? 'success' : 'critical'}>
                        {product.total_inventory > 0 ? 'Active' : 'Inactive'}
                    </Badge>
                </IndexTable.Cell>
                <IndexTable.Cell>
                    <InlineStack gap="200">
                        <Button
                            icon={ViewIcon}
                            variant="plain"
                            accessibilityLabel={`View ${product.title}`}
                            onClick={() => {
                                setViewProduct(product);
                                shopify.modal.show('product-detail-modal');
                            }}
                        />
                        <Button
                            icon={DeleteIcon}
                            variant="plain"
                            tone="critical"
                            accessibilityLabel={`Delete ${product.title}`}
                            onClick={() => console.log('Delete', product.id)}
                        />
                    </InlineStack>
                </IndexTable.Cell>
            </IndexTable.Row>
        ),
    );


    const fetchProducts = useCallback(async (url = null, direction = 'next') => {
        setLoading(true);
        setError(null);
        setSelectedItems([]);
        try {
            const fetchUrl = url || route('products.index', query);
            const response = await fetch(fetchUrl, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'ngrok-skip-browser-warning': 'true',
                },
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const data = await response.json();
            setProducts(Array.isArray(data.data) ? data.data : []);
            setNextPageUrl(data.next_page_url || null);
            setPrevPageUrl(data.prev_page_url || null);

            if (!url) {
                setPageNumber(1);
            } else if (direction === 'next') {
                setPageNumber((prev) => prev + 1);
            } else {
                setPageNumber((prev) => Math.max(1, prev - 1));
            }
        } catch (err) {
            console.error('Failed to fetch products:', err);
            setError('Failed to load products. Please try again.');
        } finally {
            setLoading(false);
        }
    }, [query]);

    // Fetch products when modal opens
    useEffect(() => {
        const modal = document.getElementById('my-modal');
        if (modal) {
            const onShow = () => {
                setPageNumber(1);
                setNextPageUrl(null);
                setPrevPageUrl(null);
                fetchProducts(null, 'next');
            };
            modal.addEventListener('show', onShow);
            return () => modal.removeEventListener('show', onShow);
        }
    }, [fetchProducts]);

    const handleNextPage = useCallback(() => {
        if (nextPageUrl) {
            fetchProducts(nextPageUrl, 'next');
        }
    }, [nextPageUrl, fetchProducts]);

    const handlePreviousPage = useCallback(() => {
        if (prevPageUrl) {
            fetchProducts(prevPageUrl, 'prev');
        }
    }, [prevPageUrl, fetchProducts]);

    // const resourceName = {
    //     singular: 'product',
    //     plural: 'products',
    // };

    const promotedBulkActions = [
        {
            content: 'Edit products',
            onAction: () => console.log('Todo: implement bulk edit'),
        },
    ];

    const bulkActions = [
        {
            content: 'Add tags',
            onAction: () => console.log('Todo: implement bulk add tags'),
        },
        {
            content: 'Remove tags',
            onAction: () => console.log('Todo: implement bulk remove tags'),
        },
        {
            icon: DeleteIcon,
            destructive: true,
            content: 'Delete products',
            onAction: () => console.log('Todo: implement bulk delete'),
        },
    ];

    function renderItem(item) {
        const { id, title, image, price, total_inventory, variants } = item;
        const media = (
            <Thumbnail
                source={image || ImageIcon}
                alt={title}
                size="small"
            />
        );

        return (
            <ResourceItem
                id={id}
                media={media}
                accessibilityLabel={`View details for ${title}`}
            >
                <InlineStack align="space-between" blockAlign="center">
                    <BlockStack gap="100">
                        <Text fontWeight="bold" as="span">
                            {title}
                        </Text>
                        <Text as="span" tone="subdued">
                            {variants?.length || 0} variant(s)
                        </Text>
                    </BlockStack>
                    <InlineStack gap="400" blockAlign="center">
                        <Text as="span">${price || '0.00'}</Text>
                        <Badge tone={total_inventory > 0 ? 'success' : 'critical'}>
                            {total_inventory ?? 0} in stock
                        </Badge>
                    </InlineStack>
                </InlineStack>
            </ResourceItem>
        );
    }

    const modalContent = () => {
        if (loading) {
            return (
                <Box padding="400">
                    <InlineStack align="center">
                        <Spinner accessibilityLabel="Loading products" size="large" />
                    </InlineStack>
                </Box>
            );
        }

        if (error) {
            return (
                <Box padding="400">
                    <Banner tone="critical">
                        <p>{error}</p>
                    </Banner>
                </Box>
            );
        }

        if (products.length === 0) {
            return (
                <Box padding="400">
                    <Banner tone="info">
                        <p>No products found. Sync your products from Shopify first.</p>
                    </Banner>
                </Box>
            );
        }

        return (
            <BlockStack gap="400">
                <Card padding="0">
                    <ResourceList
                        resourceName={resourceName}
                        items={products}
                        renderItem={renderItem}
                        selectedItems={selectedItems}
                        onSelectionChange={setSelectedItems}
                        promotedBulkActions={promotedBulkActions}
                        bulkActions={bulkActions}
                    />
                    <Box padding="300" borderBlockStartWidth="025" borderColor="border">
                        <InlineStack align="space-between">
                            <Text as="span">Showing {products.length} products</Text>
                            <Text as="span" fontWeight="bold">Page {pageNumber}</Text>
                        </InlineStack>
                    </Box>
                    <Box padding="300" borderBlockStartWidth="025" borderColor="border">
                        <InlineStack align="center">
                            <Pagination
                                hasPrevious={!!prevPageUrl}
                                onPrevious={handlePreviousPage}
                                hasNext={!!nextPageUrl}
                                onNext={handleNextPage}
                                label={`Page ${pageNumber}`}
                            />
                        </InlineStack>
                    </Box>
                </Card>
            </BlockStack>
        );
    };

    return (
        <Box paddingInline={'800'}>
            <Page
                title='Dashboard'
                fullWidth
            >
                <BlockStack gap="400">
                    <Card>
                        <BlockStack gap="300">
                            <Text as='h3' variant='headingLg'>Product Sync Job</Text>
                            <Text as='p' variant='bodyMd'>Use the button below to sync products from your Shopify store to the app's database.</Text>
                            <InlineStack align="start">
                                <Button tone='success' onClick={() => shopify.modal.show('my-modal')}>View Synced Products</Button>
                            </InlineStack>
                        </BlockStack>
                    </Card>

                    {/* <Card>
                        <Text as='h2' variant='headingLg'>Collection Data </Text>

                        {collectionsLoading ? (
                            <InlineStack align="center">
                                <Spinner accessibilityLabel="Loading collections" size="small" />
                            </InlineStack>
                        ) : (
                            <Select
                                label="Collection"
                                options={collectionOptions}
                                onChange={handleCollectionChange}
                                value={selectedCollection}
                                placeholder="Select a collection"
                            />
                        )}
                    </Card> */}


                    <LegacyCard>
                        <IndexFilters
                            sortOptions={sortOptions}
                            sortSelected={sortSelected}
                            queryValue={queryValue}
                            queryPlaceholder="Searching in all"
                            onQueryChange={handleFiltersQueryChange}
                            onQueryClear={() => setQueryValue('')}
                            onSort={setSortSelected}
                            primaryAction={primaryAction}
                            cancelAction={{
                                onAction: onHandleCancel,
                                disabled: false,
                                loading: false,
                            }}
                            tabs={tabs}
                            selected={selected}
                            onSelect={setSelected}
                            canCreateNewView
                            onCreateNewView={onCreateNewView}
                            filters={filters}
                            appliedFilters={appliedFilters}
                            onClearAll={handleFiltersClearAll}
                            mode={mode}
                            setMode={setMode}
                        />
                        <IndexTable
                            condensed={useBreakpoints().smDown}
                            resourceName={resourceName}
                            itemCount={tableProducts.length}
                            selectedItemsCount={
                                allResourcesSelected ? 'All' : selectedResources.length
                            }
                            onSelectionChange={handleSelectionChange}
                            headings={[
                                { title: 'Product Id' },
                                { title: 'Image' },
                                { title: 'Product Name' },
                                { title: 'Price' },
                                { title: 'Inventory' },
                                { title: 'Status' },
                                { title: 'Actions' },
                            ]}
                            loading={tableLoading}
                        >
                            {rowMarkup}
                        </IndexTable>
                        <Box padding="300" borderBlockStartWidth="025" borderColor="border">
                            <InlineStack align="center">
                                <Pagination
                                    hasPrevious={!!tablePrevPageUrl}
                                    onPrevious={handleTablePreviousPage}
                                    hasNext={!!tableNextPageUrl}
                                    onNext={handleTableNextPage}
                                    label={`Page ${tablePageNumber}`}
                                />
                            </InlineStack>
                        </Box>
                    </LegacyCard>


                </BlockStack>

                <ui-modal id="my-modal" variant="large">
                    <Box padding="400">
                        {modalContent()}
                    </Box>
                    <ui-title-bar title="Synced Products">
                        <button variant="primary" onClick={() => shopify.modal.hide('my-modal')}>Close</button>
                    </ui-title-bar>
                </ui-modal>

                <ui-modal id="product-detail-modal" variant="large">
                    <Box padding="400">
                        {viewProduct ? (
                            <BlockStack gap="400">
                                <InlineStack gap="400" blockAlign="start">
                                    <Thumbnail
                                        source={viewProduct.image || ImageIcon}
                                        alt={viewProduct.title}
                                        size="large"
                                    />
                                    <BlockStack gap="200">
                                        <Text variant="headingLg" as="h2">{viewProduct.title}</Text>
                                        <Text as="span" tone="subdued">ID: {viewProduct.shopify_product_id}</Text>
                                        <InlineStack gap="300">
                                            <Badge tone={viewProduct.total_inventory > 0 ? 'success' : 'critical'}>
                                                {viewProduct.total_inventory ?? 0} in stock
                                            </Badge>
                                            <Text as="span" fontWeight="bold">${viewProduct.price || '0.00'}</Text>
                                        </InlineStack>
                                    </BlockStack>
                                </InlineStack>

                                <Box borderBlockStartWidth="025" borderColor="border" paddingBlockStart="400">
                                    <BlockStack gap="300">
                                        <Text variant="headingMd" as="h3">
                                            Variants ({viewProduct.variants?.length || 0})
                                        </Text>
                                        {viewProduct.variants && viewProduct.variants.length > 0 ? (
                                            <IndexTable
                                                resourceName={{ singular: 'variant', plural: 'variants' }}
                                                itemCount={viewProduct.variants.length}
                                                headings={[
                                                    { title: 'Title' },
                                                    { title: 'Price' },
                                                    { title: 'Inventory' },
                                                ]}
                                                selectable={false}
                                            >
                                                {viewProduct.variants.map((variant, idx) => (
                                                    <IndexTable.Row
                                                        id={String(variant.id)}
                                                        key={variant.id}
                                                        position={idx}
                                                    >
                                                        <IndexTable.Cell>
                                                            <Text variant="bodyMd" as="span">{variant.title}</Text>
                                                        </IndexTable.Cell>
                                                        <IndexTable.Cell>
                                                            <Text as="span" numeric>${variant.price || '0.00'}</Text>
                                                        </IndexTable.Cell>
                                                        <IndexTable.Cell>
                                                            <Badge tone={variant.inventory_quantity > 0 ? 'success' : 'critical'}>
                                                                {variant.inventory_quantity ?? 0}
                                                            </Badge>
                                                        </IndexTable.Cell>
                                                    </IndexTable.Row>
                                                ))}
                                            </IndexTable>
                                        ) : (
                                            <Banner tone="info">
                                                <p>No variants found for this product.</p>
                                            </Banner>
                                        )}
                                    </BlockStack>
                                </Box>
                            </BlockStack>
                        ) : (
                            <InlineStack align="center">
                                <Spinner accessibilityLabel="Loading" size="large" />
                            </InlineStack>
                        )}
                    </Box>
                    <ui-title-bar title={viewProduct?.title || 'Product Details'}>
                        <button variant="primary" onClick={() => shopify.modal.hide('product-detail-modal')}>Close</button>
                    </ui-title-bar>
                </ui-modal>

            </Page>
        </Box>
    );
}



function disambiguateLabel(key, value) {
    switch (key) {
        case 'moneySpent':
            return `Money spent is between $${value[0]} and $${value[1]}`;
        case 'taggedWith':
            return `Tagged with ${value}`;
        case 'accountStatus':
            return (value).map((val) => `Customer ${val}`).join(', ');
        default:
            return value;
    }
}

function isEmpty(value) {
    if (Array.isArray(value)) {
        return value.length === 0;
    } else {
        return value === '' || value == null;
    }
}
