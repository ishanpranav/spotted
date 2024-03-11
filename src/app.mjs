// app.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

import express from 'express';
import { config } from 'dotenv';
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url';

config();

const rootDirectory = dirname(fileURLToPath(import.meta.url));
const port = process.env.PORT;

express()
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
    })
    .listen(port, () => {
        console.log(`Started server on HTTP port ${port}...`);
    });
