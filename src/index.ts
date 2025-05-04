import 'reflect-metadata';

import http from 'http';

import express from "express";
import cookieSession from "cookie-session";
import cors from 'cors';

async function bootstrap() {
  const app = express();
  const httpServer: http.Server = new http.Server(app);

  app.set('trust proxy', 1);
  app.use(
    cookieSession({
      name: 'session',
      keys: ['djjw2i348282', 'jduwu2uu4'],
      maxAge: 24 * 7 * 3600000
    })
  );
  const corsOptions = {
    origin: ['http://localhost:4000', 'http://localhost:4200'],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  };
  app.use(cors(corsOptions));

  try {
    httpServer.listen(5000, () => {
      console.log(`Server running on port 5000`);
    })
  } catch (error) {
    console.log('Error starting server');
  }
}

bootstrap().catch(console.error);
