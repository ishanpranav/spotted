// local-app.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

import https from 'https';
import { readFileSync } from 'fs';
import { resolve } from 'path';
import { app, rootDirectory } from './app.mjs';

const publicKeyPath = resolve(rootDirectory, 'public-key.pem');
const privateKeyPath = resolve(rootDirectory, 'private-key.pem');
const port = process.env.PORT || 3001;

https
    .createServer({
        cert: readFileSync(publicKeyPath, 'utf-8'),
        key: readFileSync(privateKeyPath, 'utf-8')
    }, app)
    .listen(port, () => {
        console.log(`Started server on HTTPS port ${port}...`);
    });
