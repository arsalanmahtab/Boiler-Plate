import {
    Box, 
    Page,
    Text
} from '@shopify/polaris';

export default function Dashboard() {
    return (
        <Box paddingInline={'800'}>
            <Page
                title='Dashboard'
                fullWidth
                backAction={() => { }}
            >

                <Text>Product Sync Job </Text>
                <Text>Use the button below to sync products from your Shopify store to the app's database.</Text>
            </Page>
        </Box>
    )
}
