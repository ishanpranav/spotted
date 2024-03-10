// app.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

import express from 'express';
import { config } from 'dotenv';
import { dirname, resolve } from 'path'
import { fileURLToPath } from 'url';

/** Specifies the source root directory. */
export const rootDirectory = dirname(fileURLToPath(import.meta.url));

config();

/** Specifies a configurable Express application. */
export const app = express()
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

if (process.env.SPOTTED_HTTP) {
    app.listen(process.env.PORT, () => {
        console.log(`Started server on HTTP port ${port}...`);
    });
}
