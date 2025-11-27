'use client';

import { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import Switch from '@mui/material/Switch';
import FormControlLabel from '@mui/material/FormControlLabel';
import TextField from '@mui/material/TextField';
import Button from '@mui/material/Button';
import { saveSettings } from '@/app/actions';

interface SettingsFormProps {
    initialSettings: {
        dataSource: string;
        igdbClientId: string;
        igdbClientSecret: string;
        geminiApiKey: string;
    }
}

export default function SettingsForm({ initialSettings }: SettingsFormProps) {
    const [dataSource, setDataSource] = useState(initialSettings.dataSource);
    const [igdbClientId, setIgdbClientId] = useState(initialSettings.igdbClientId);
    const [igdbClientSecret, setIgdbClientSecret] = useState(initialSettings.igdbClientSecret);
    const [geminiApiKey, setGeminiApiKey] = useState(initialSettings.geminiApiKey);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        await saveSettings({
            dataSource,
            igdbClientId,
            igdbClientSecret,
            geminiApiKey
        });
        setIsSaving(false);
        alert('Settings saved!');
    };

    return (
        <Box>
            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>Data Source</Typography>
                    <FormControlLabel
                        control={
                            <Switch
                                checked={dataSource === 'IGDB'}
                                onChange={(e) => setDataSource(e.target.checked ? 'IGDB' : 'WIKIPEDIA')}
                                color="secondary"
                            />
                        }
                        label={dataSource === 'IGDB' ? "Using IGDB (Rich Data)" : "Using Wikipedia (Free Data)"}
                    />

                    {dataSource === 'IGDB' && (
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                label="IGDB Client ID"
                                fullWidth
                                margin="normal"
                                value={igdbClientId}
                                onChange={(e) => setIgdbClientId(e.target.value)}
                            />
                            <TextField
                                label="IGDB Client Secret"
                                fullWidth
                                margin="normal"
                                type="password"
                                value={igdbClientSecret}
                                onChange={(e) => setIgdbClientSecret(e.target.value)}
                            />
                        </Box>
                    )}
                </CardContent>
            </Card>

            <Card sx={{ mb: 3 }}>
                <CardContent>
                    <Typography variant="h6" gutterBottom>AI Configuration</Typography>
                    <Typography variant="body2" color="text.secondary" gutterBottom>
                        Required for "The Historian's Manual" dynamic content generation.
                    </Typography>
                    <TextField
                        label="Google Gemini API Key"
                        fullWidth
                        margin="normal"
                        type="password"
                        value={geminiApiKey}
                        onChange={(e) => setGeminiApiKey(e.target.value)}
                        placeholder="AIza..."
                    />
                </CardContent>
            </Card>

            <Button
                variant="contained"
                color="primary"
                fullWidth
                size="large"
                onClick={handleSave}
                disabled={isSaving}
                sx={{ mb: 2 }}
            >
                {isSaving ? "Saving..." : "Save Settings"}
            </Button>

            <Button
                variant="outlined"
                color="secondary"
                fullWidth
                size="large"
                onClick={async () => {
                    setIsSaving(true);
                    const { syncGameData } = await import('@/app/actions');
                    await syncGameData();
                    setIsSaving(false);
                    alert('Data sync started! Check Games page in a moment.');
                }}
                disabled={isSaving}
            >
                Sync Game Data (Fetch Covers)
            </Button>
        </Box>
    );
}
