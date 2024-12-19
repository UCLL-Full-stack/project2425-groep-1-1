import * as dotenv from 'dotenv';
import express, { Request, Response, NextFunction } from 'express';
import cors from 'cors';
import * as bodyParser from 'body-parser';
import swaggerJSDoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { expressjwt } from 'express-jwt';
import helmet from "helmet";

import { speedrunRouter } from './controller/speedrun.routes';
import { gameRouter } from './controller/game.routes';
import { categoryRouter } from './controller/category.routes';
import { userRouter } from "./controller/user.routes";
import { speedrunEventRouter } from "./controller/speedrun_event.routes";

const app = express();
app.use(helmet());
dotenv.config();
const port = process.env.APP_PORT || 3000;

app.use(cors({ origin: 'http://localhost:8080' }));
app.use(bodyParser.json());

const openPaths = ['/api-docs', /^\/api-docs\/.*/, '/users/login', '/users/signup', '/status'];
const openGetPaths = ['/games', /^\/games\/.*/, '/categories', /^\/categories\/.*/, '/speedruns', /^\/speedruns\/.*/, '/speedrun-events', /^\/speedrun-events\/.*/];
app.use(
  expressjwt({
      secret: process.env.JWT_SECRET || 'default_secret',
      algorithms: ['HS256'],
  }).unless({
      custom: (req) => {
        if (req.method === "GET") {
          const result = openGetPaths.some((path) =>
            typeof path === "string" ? req.path === path : path.test(req.path));

          if (result) {
            return true;
          }
        }

        return openPaths.some((path) =>
          typeof path === "string" ? req.path === path : path.test(req.path));
      },
  })
);

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

app.use('/users', userRouter);
app.use('/speedruns', speedrunRouter);
app.use('/speedrun-events', speedrunEventRouter);
app.use('/games', gameRouter);
app.use('/categories', categoryRouter);

app.use((error: Error, req: Request, res: Response, next: NextFunction) => {
    res.status(400).json({
        status: 'application error',
        message: error.message,
    });
});

export default app;
