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

import { Message } from './message.mjs';

await connect(process.env.DSN);

const app = express();
const server = createServer(app);
const socketIO = new Server(server);
const publicDirectory = join(dirname(fileURLToPath(import.meta.url)), 'public');

app
    .set('view engine', 'hbs')
    .use(express.json())
    .use(express.static(publicDirectory))
    .get('/', async (request, response) => {
        response.render('post');
    })
    .post('/api/message', async (request, response) => {
        request.body.content = request.body.content.trim();

        if (!request.body.content.length) {
            response.sendStatus(200);
        }

        const message = new Message(request.body);

        await message.save();

        response.sendStatus(200);
    })
    .get('/api/messages', async (request, response) => {
        const longitude = request.query.longitude;
        const latitude = request.query.latitude;
        const accuracy = request.query.accuracy;
        
        response.json(await Message.find());
    });

server.listen(process.env.PORT || 3000);
socketIO.on('connection', socket => {
    socket.on('post', message => {
        socket.broadcast.emit('posted', message);
    });
});
