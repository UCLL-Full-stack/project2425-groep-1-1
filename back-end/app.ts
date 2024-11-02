import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction, application } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { speedrunRouter } from './controller/speedrun.routes';

const app = express();
dotenv.config();
const port = process.env.APP_PORT || 3000;

app.use(cors({ origin: 'http://localhost:8080' }));
app.use(bodyParser.json());

app.get('/status', (req, res) => {
    res.json({ message: 'Speedrun API is running...' });
});

const swaggerOpts = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'Speedrun API',
            version: '1.0.0',
        },
    },
    apis: ['./controller/*.routes.ts'],
};
const swaggerSpec = swaggerJSDoc(swaggerOpts);
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));

app.listen(port || 3000, () => {
    console.log(`Speedrun API is running on port ${port}.`);
});

app.use('/speedruns', speedrunRouter);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(400).json({
        status: 'application error',
        message: error.message,
    });
});

export default app;
