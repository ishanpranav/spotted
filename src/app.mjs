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
    .use(express.static(publicDirectory))
    .use(express.urlencoded({
        extended: false
    }))
    .get('/', async (request, response) => {
        response.render('post', {
            messages: await Message.find()
        });
    })
    .post('/', async (request, response) => {
        const message = new Message();

        message.content = request.body.message;

        await message.save();

        response.redirect('/');
    });

server.listen(process.env.PORT || 3000);
socketIO.on('connection', socket => {
    console.log(socket.id, 'connected');

    socket.on('post', message => {
        socket.broadcast.emit('posted', message);
    });
});
