// Import required modules and components
import express from 'express';
import { Request, Response, NextFunction } from 'express';
import userRoutes from "./routes/userRoutes.js";
import folderRoutes from './routes/folderRoutes.js';
import noteRoutes from './routes/noteRoutes.js';
import authRoutes from './routes/authRoutes.js';
import awsRoutes from './routes/awsRoutes.js';
import swaggerSpec from './swaggerConfig.js';
import swaggerUi from 'swagger-ui-express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import http from 'http';
import initializeWebSocketServer from './wbSocket/webSocketServer.js';


// Initialize Express app
const app = express();

// Set default port or use provided PORT environment variable
const PORT = process.env.PORT || 8000;

// create a server object:
const server = http.createServer(app);

// Initialize the WebSocket server
initializeWebSocketServer(server);

const allowedOrigins = [process.env.ALLOWED_ORIGIN, 'http://localhost:3000'];

const corsOptions: cors.CorsOptions = {
    credentials: true,
    origin: (origin: string | undefined, callback: (err: Error | null, allow?: boolean) => void) => {
        if (!origin || allowedOrigins.includes(origin)) {
            callback(null, true);
        } else {
            callback(new Error('Not allowed by CORS'), false);
        }
    }
};

// Enable CORS
app.use(cors(corsOptions));
  

// Enable cookie parser
app.use(cookieParser());

// Middleware configuration
// Enable express to parse JSON data
app.use(express.json());

// Swagger documentation setup
// '/api-docs' endpoint serves the Swagger UI based on the swaggerSpec configuration
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

// Route configuration
// All API routes are prefixed with '/api/v1'
app.use('/api/v1', userRoutes);

app.use('/api/v1', folderRoutes);

app.use('/api/v1', noteRoutes);

app.use('/api/v1', authRoutes);

app.use('/api/v1/aws', awsRoutes);

// A custom 404 'not found' middleware
app.use((req, res, next) => {
    res.status(404).send("404 Page Not Found");
    next();
});

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
    console.error(err.stack);
    res.status(500).send('Internal Server Error');
    next();
});



// Start the server
// Listens for requests on the specified PORT
server.listen(PORT, () => {
    console.log(`Server is now listening on port ${PORT}`);
});
