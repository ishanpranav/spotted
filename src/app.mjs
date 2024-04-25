// app.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import './config.mjs'; // first

import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { createServer } from 'http';
import { connect } from 'mongoose';
import { Strategy } from 'passport-google-oauth20';
import { dirname, join } from 'path';
import { Server } from 'socket.io';
import { fileURLToPath } from 'url';
import { MessageRepository } from './message-repository.mjs';

await connect(process.env.DSN);

const app = express();
const server = createServer(app);
const socketIO = new Server(server);
const rootDirectory = dirname(fileURLToPath(import.meta.url));
const publicDirectory = join(rootDirectory, 'public');
const repository = new MessageRepository();

passport.use(new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, (acessToken, refreshToken, profile, done) => {
    console.log("Create user called ", profile);

    done(null, profile);
}));

passport.serializeUser((user, callback) => {
    process.nextTick(() => {
        callback(null, {
            id: user.id,
            username: user.username,
            name: user.name
        });
    });
});

passport.deserializeUser((user, callback) => {
    process.nextTick(() => callback(null, user));
});

app
    .set('view engine', 'hbs')
    .use(express.json({
        limit: '32mb'
    }))
    .use(session({
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }))
    .use(express.static(publicDirectory))
    .use(passport.authenticate('session'))
    .get('/', async (_, response) => {
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
    })
    .get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }))
    .get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/login',
        successRedirect: '/'
    }));

server.listen(process.env.PORT || 3000);
socketIO.on('connection', socket => {
    socket.on('post', message => {
        socket.broadcast.emit('posted', message);
    });
});
