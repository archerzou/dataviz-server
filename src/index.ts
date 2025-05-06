import 'reflect-metadata';

import http from 'http';

import express from "express";
import cookieSession from "cookie-session";
import cors from 'cors';
import { envConfig } from './config/env.config';
import {AppDataSource} from "@/database/config";

async function bootstrap() {
  const app = express();
  const httpServer: http.Server = new http.Server(app);

  app.set('trust proxy', 1);
  app.use(
    cookieSession({
      name: 'session',
      keys: [envConfig.SECRET_KEY_ONE, envConfig.SECRET_KEY_TWO],
      maxAge: 24 * 7 * 3600000,
      secure: envConfig.NODE_ENV !== 'development',
      ...(envConfig.NODE_ENV !== 'development' && {
        sameSite: 'none'
      }),
      httpOnly: envConfig.NODE_ENV !== 'development'
    })
  );
  const corsOptions = {
    origin: [envConfig.REACT_URL, envConfig.ANGULAR_URL],
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS']
  };
  app.use(cors(corsOptions));

  try {
    httpServer.listen(envConfig.PORT, () => {
      console.log(`Server running on port ${envConfig.PORT}`);
    })
  } catch (error) {
    console.log('Error starting server');
  }
}

AppDataSource.initialize().then(() => {
  console.log('PostgreSQL database connected successfully.');
  bootstrap().catch(console.error);
}).catch((error) => console.log('Error connecting to PostgreSQL.', error));
