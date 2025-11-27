import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Card from '@mui/material/Card';
import CardMedia from '@mui/material/CardMedia';
import CardContent from '@mui/material/CardContent';
import TextField from '@mui/material/TextField';
import InputAdornment from '@mui/material/InputAdornment';
import SearchIcon from '@mui/icons-material/Search';
import { prisma } from '@/lib/db';
import { redirect } from 'next/navigation';

export const dynamic = 'force-dynamic';

async function getGames(query?: string) {
    return await prisma.game.findMany({
        where: query ? {
            title: { contains: query, mode: 'insensitive' }
        } : {},
        orderBy: { title: 'asc' },
        include: {
            weeks: {
                select: { weekNumber: true, title: true }
            }
        }
    });
}

export default async function GamesPage({ searchParams }: { searchParams: Promise<{ q?: string }> }) {
    const { q } = await searchParams;
    const games = await getGames(q);

    async function searchGames(formData: FormData) {
        'use server';
        const query = formData.get('q');
        redirect(`/games?q=${query}`);
    }

    return (
        <Box sx={{ p: 2 }}>
            <Typography variant="h4" gutterBottom sx={{ fontWeight: 'bold', color: 'primary.main' }}>
                Game Library
            </Typography>

            <Box component="form" action={searchGames} sx={{ mb: 3 }}>
                <TextField
                    name="q"
                    fullWidth
                    placeholder="Search games..."
                    defaultValue={q}
                    variant="outlined"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <SearchIcon />
                            </InputAdornment>
                        ),
                    }}
                />
            </Box>

            <Grid container spacing={2}>
                {games.map((game: any) => (
                    <Grid size={{ xs: 6, sm: 4, md: 3 }} key={game.id}>
                        <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                            <CardMedia
                                component="img"
                                height="140"
                                image={game.coverUrl || "https://placehold.co/600x400?text=No+Cover"}
                                alt={game.title}
                                sx={{ objectFit: 'cover' }}
                            />
                            <CardContent sx={{ flexGrow: 1 }}>
                                <Typography variant="subtitle1" component="div" sx={{ lineHeight: 1.2, mb: 1, fontWeight: 'bold' }}>
                                    {game.title}
                                </Typography>
                                <Typography variant="caption" color="text.secondary" display="block">
                                    {game.platform || 'Unknown Platform'} • {game.releaseDate ? new Date(game.releaseDate).getFullYear() : 'N/A'}
                                </Typography>
                                {game.weeks.length > 0 && (
                                    <Typography variant="caption" color="primary" sx={{ mt: 1, display: 'block', fontWeight: 'bold' }}>
                                        Week {game.weeks[0].weekNumber}: {game.weeks[0].title}
                                    </Typography>
                                )}
                            </CardContent>
                        </Card>
                    </Grid>
                ))}
            </Grid>
        </Box>
    );
}
