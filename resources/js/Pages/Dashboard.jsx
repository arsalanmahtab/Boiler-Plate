import {
    Box, 
    Page
} from '@shopify/polaris';

export default function Dashboard() {
    return (
        <Box paddingInline={'800'}>
            <Page
                title='Dashboard'
                fullWidth
                backAction={() => { }}
            >
            </Page>
        </Box>
    )
}
