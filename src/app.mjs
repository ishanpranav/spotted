// app.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import './config.mjs'; // first

import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

express()
    .use(express.static(join(dirname(fileURLToPath(import.meta.url)), 'dist')))
    .listen(process.env.PORT || 3000);
