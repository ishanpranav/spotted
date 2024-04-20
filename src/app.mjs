// app.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import './config.mjs'; // first

import express from 'express';
import { createServer } from 'http';
import { connect } from 'mongoose';
import { dirname, join } from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { MessageRepository } from './message-repository.mjs';

await connect(process.env.DSN);

const app = express();
const server = createServer(app);
const socketIO = new Server(server);
const publicDirectory = join(dirname(fileURLToPath(import.meta.url)), 'public');
const repository = new MessageRepository();

app
    .set('view engine', 'hbs')
    .use(express.json())
    .use(express.static(publicDirectory))
    .get('/', async (request, response) => {
        response.render('post');
    })
    .post('/api/message', async (request, response) => {
        await repository.addAsync(request.body);

        response.sendStatus(200);
    })
    .get('/api/messages', async (request, response) => {
        const coordinates = {
            latitude: request.query.latitude,
            longitude: request.query.longitude
        };
        const messages = await repository.getAsync(
            coordinates, 
            request.query.accuracy);

        response.json(messages);
    });

server.listen(process.env.PORT || 3000);
socketIO.on('connection', socket => {
    socket.on('post', message => {
        socket.broadcast.emit('posted', message);
    });
});
