import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { prisma } from '@/lib/db';
import SettingsForm from '@/components/SettingsForm';

export const dynamic = 'force-dynamic';

async function getSettings() {
    const settings = await prisma.appSettings.findUnique({
        where: { id: 'settings' }
    });
    return settings || { dataSource: 'WIKIPEDIA', igdbClientId: '', igdbClientSecret: '', geminiApiKey: '' };
}

export default async function SettingsPage() {
    const settings = await getSettings();

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Settings
            </Typography>

            <SettingsForm
                initialSettings={{
                    dataSource: settings.dataSource,
                    igdbClientId: settings.igdbClientId || '',
                    igdbClientSecret: settings.igdbClientSecret || '',
                    geminiApiKey: settings.geminiApiKey || ''
                }}
            />
        </Box>
    );
}
