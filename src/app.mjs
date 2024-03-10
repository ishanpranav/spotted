// app.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

import express from 'express';
import https from 'https';
import { config } from 'dotenv';
import { readFileSync } from 'fs';
import { basename, dirname, resolve } from 'path'
import { fileURLToPath } from 'url';

const rootDirectory = dirname(fileURLToPath(import.meta.url));
const secretDirectory = resolve(dirname(rootDirectory), 'etc', 'secrets');

config();

const app = express()
    .use(express.static(resolve(rootDirectory, 'public')))
    .use(express.urlencoded({ extended: false }))
    .use((request, response, next) => {
        console.log(request.method, request.path, request.query);
        next();
    })
    .set('view engine', 'hbs')
    .get('/', (request, response) => {
        if (!request.query.latitude || !request.query.longitude) {
            response.render('index');

            return;
        }

        response.render('main', {
            latitude: request.query.latitude,
            longitude: request.query.longitude,
            accuracy: request.query.accuracy
        });
    });
const publicKeyPath = resolve(secretDirectory, 'public-key.pem');
const privateKeyPath = resolve(secretDirectory, 'private-key.pem');
const httpsPort = process.env.SPOTTED_HTTPS_PORT || 3001;
const hostname = process.env.SPOTTED_HOSTNAME;

https
    .createServer({
        cert: readFileSync(publicKeyPath, 'utf-8'),
        key: readFileSync(privateKeyPath, 'utf-8')
    }, app)
    .listen(httpsPort, hostname);

console.log(`Started serving on https://${hostname}:${httpsPort}/`);
