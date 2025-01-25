// Node server (node/index.ts)
import express, { Request, Response } from 'express';
import axios from 'axios';
import cors from 'cors';

interface Comment {
    postId: number;
    id: number;
    name: string;
    email: string;
    body: string;
}

interface CacheEntry {
    data: Comment[];
    expiry: number;
}

const app = express();
app.use(
    cors({
        origin: 'http://localhost:3000',  // Allow requests only from localhost:3000
    })
);

const CACHE = new Map<string, CacheEntry>();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

app.get('/search', async (req: Request, res: Response): Promise<void> => {
    console.log(req);
    try {
        const query = req.query.q as string;
        if (!query) {
            res.status(400).json({ error: 'Query parameter q is required' });
            return;
        }

        const cacheKey = `comments_postId_3`;
        const now = Date.now();

        if (CACHE.has(cacheKey) && CACHE.get(cacheKey)!.expiry > now) {
            const cachedData = CACHE.get(cacheKey)!.data;
            const filteredData = cachedData.filter((comment: any) =>
                comment.name.toLowerCase().includes(query.toLowerCase())
            );
            res.json(filteredData);
            return;
        }

        const response = await axios.get(
            'https://jsonplaceholder.typicode.com/comments?postId=3'
        );
        
        const comments = response.data;
        CACHE.set(cacheKey, { data: comments, expiry: now + CACHE_DURATION });

        const filteredData = comments.filter((comment: any) =>
            comment.name.toLowerCase().includes(query.toLowerCase())
        );
        res.json(filteredData);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
});



app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
