// app.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import { config } from 'dotenv';
import express from 'express';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';

const app = express();
const fileName = fileURLToPath(import.meta.url);
const directoryName = join(dirname(fileName), 'dist');

config();
app.use(express.static(directoryName));
app.listen(process.env.PORT || 30001);
