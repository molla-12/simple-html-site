"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
// Node server (node/index.ts)
const express_1 = __importDefault(require("express"));
const axios_1 = __importDefault(require("axios"));
const cors_1 = __importDefault(require("cors"));
const app = (0, express_1.default)();
app.use((0, cors_1.default)());
const CACHE = new Map();
const CACHE_DURATION = 5 * 60 * 1000; // 5 minutes
app.get('/search', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const query = req.query.q;
        if (!query) {
            res.status(400).json({ error: 'Query parameter q is required' });
            return;
        }
        const cacheKey = `comments_postId_3`;
        const now = Date.now();
        if (CACHE.has(cacheKey) && CACHE.get(cacheKey).expiry > now) {
            const cachedData = CACHE.get(cacheKey).data;
            const filteredData = cachedData.filter((comment) => comment.name.toLowerCase().includes(query.toLowerCase()));
            res.json(filteredData);
            return;
        }
        const response = yield axios_1.default.get('https://jsonplaceholder.typicode.com/comments?postId=3');
        const comments = response.data;
        CACHE.set(cacheKey, { data: comments, expiry: now + CACHE_DURATION });
        const filteredData = comments.filter((comment) => comment.name.toLowerCase().includes(query.toLowerCase()));
        res.json(filteredData);
    }
    catch (error) {
        res.status(500).json({ error: 'Failed to fetch comments' });
    }
}));
app.listen(3001, () => {
    console.log('Server is running on port 3001');
});
