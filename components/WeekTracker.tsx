'use client';

import { useState } from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import TextField from '@mui/material/TextField';
import Typography from '@mui/material/Typography';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import RadioButtonUncheckedIcon from '@mui/icons-material/RadioButtonUnchecked';
import { updateWeekProgress } from '@/app/actions';

interface WeekTrackerProps {
    weekId: string;
    isCompleted: boolean;
    highScore: string | null;
    notes: string | null;
}

export default function WeekTracker({ weekId, isCompleted, highScore, notes }: WeekTrackerProps) {
    const [completed, setCompleted] = useState(isCompleted);
    const [score, setScore] = useState(highScore || '');
    const [note, setNote] = useState(notes || '');
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        setIsSaving(true);
        await updateWeekProgress(weekId, completed, score, note);
        setIsSaving(false);
    };

    return (
        <Box sx={{ mt: 2, p: 2, bgcolor: 'background.default', borderRadius: 1 }}>
            <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <Button
                    variant={completed ? "contained" : "outlined"}
                    color={completed ? "success" : "primary"}
                    startIcon={completed ? <CheckCircleIcon /> : <RadioButtonUncheckedIcon />}
                    onClick={() => setCompleted(!completed)}
                    sx={{ mr: 2 }}
                >
                    {completed ? "Mission Complete!" : "Mark Complete"}
                </Button>
            </Box>

            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                <TextField
                    label="High Score / Best Run"
                    variant="outlined"
                    size="small"
                    value={score}
                    onChange={(e) => setScore(e.target.value)}
                    fullWidth
                    placeholder="e.g. 50,000 pts or Level 4"
                />
                <TextField
                    label="Mission Notes"
                    variant="outlined"
                    size="small"
                    value={note}
                    onChange={(e) => setNote(e.target.value)}
                    fullWidth
                    placeholder="Strategy used, favorite moment..."
                />
            </Box>

            <Box sx={{ mt: 2, textAlign: 'right' }}>
                <Button
                    variant="contained"
                    onClick={handleSave}
                    disabled={isSaving}
                >
                    {isSaving ? "Saving..." : "Save Progress"}
                </Button>
            </Box>
        </Box>
    );
}
