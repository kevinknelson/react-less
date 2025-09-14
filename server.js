import jsonServer from 'json-server';
import cors from 'cors';

const server = jsonServer.create();
const router = jsonServer.router('_testdb.json');
const middlewares = jsonServer.defaults();

// Enable CORS
server.use(cors());

// Add delay middleware
server.use((req, res, next) => {
    if (req.method === 'OPTIONS') {
        return next(); // Skip delay for preflight requests
    }
    setTimeout(() => next(), 1000); // Add 3-second delay
});

server.use(middlewares);
server.use(router);

const PORT = 4000;
server.listen(PORT, () => {
    console.log(`JSON Server is running on http://localhost:${PORT}`);
});