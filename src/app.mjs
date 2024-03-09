// app.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

import express from 'express';
import http from 'http';
import https from 'https';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url';

const rootDirectory = dirname(fileURLToPath(import.meta.url));

config();

const app = express()
    .use(express.static(resolve(rootDirectory, 'public')))
    .set('view engine', 'hbs')
    .get('/', (request, response) => {
        response.render('index');
    });
const publicKeyPath = resolve(rootDirectory, 'public-key.pem');
const privateKeyPath = resolve(rootDirectory, 'private-key.pem');
const httpsPort = process.env.SPOTTED_HTTPS_PORT || 3001;
const hostname = process.env.SPOTTED_HOSTNAME;

https
    .createServer({
        cert: readFileSync(publicKeyPath, 'utf-8'),
        key: readFileSync(privateKeyPath, 'utf-8')
    }, app)
    .listen(httpsPort, hostname);

console.log(`Started serving on https://${hostname}:${httpsPort}/`);

const httpPort = process.env.SPOTTED_HTTP_PORT || 3000;

http
    .createServer(app)
    .listen(httpPort, hostname);

console.log(`Started serving on http://${hostname}:${httpPort}/`);
