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
        response.render('post');
    })
    .post('/', async (request, response) => {
        const message = new Message();

        message.content = request.body.message;

        await message.save();

        console.log('saved to db and firing posted with data 1');
        // socketIO.emit('posted', { data: 1 });

        response.redirect('/');
    })
    .get('/login', async (request, response) => {
        await getMessagesAsync();
    });

server.listen(process.env.PORT || 3000);

socketIO.on('connection', socket => {
    console.log(socket);
    console.log(socket.id, 'connected');
    socket.emit('posted', {data:1});
});

async function getMessagesAsync() {
    const data = await Message.find();

    console.log(data);

    return data;
}
