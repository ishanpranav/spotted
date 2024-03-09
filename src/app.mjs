// app.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

import express from 'express'
import path from 'path'
import { fileURLToPath } from 'url';

const fileName = fileURLToPath(import.meta.url);
const directoryName = path.dirname(fileName);

express().listen(process.env.PORT || 3000);
