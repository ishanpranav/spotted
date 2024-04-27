// app.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import express from 'express';
import session from 'express-session';
import nconf from 'nconf';
import passport from 'passport';
import { config } from 'dotenv';
import { connect } from 'mongoose';
import { Strategy } from 'passport-google-oauth20';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { MessageRepository } from './message-repository.mjs';
import { UserRepository } from './user-repository.mjs';

config();
nconf
    .argv()
    .env();

await connect(nconf.get('DSN'));

const rootDirectory = dirname(fileURLToPath(import.meta.url));
const publicDirectory = join(rootDirectory, 'public');
const messages = new MessageRepository();
const users = new UserRepository();

passport.use(new Strategy({
    clientID: nconf.get('GOOGLE_CLIENT_ID'),
    clientSecret: nconf.get('GOOGLE_CLIENT_SECRET'),
    callbackURL: nconf.get('GOOGLE_CALLBACK_URL')
}, async (accessToken, refreshToken, profile, done) => {
    await users.addAsync({
        accountId: profile.id,
        name: profile.displayName,
        imageURL: profile.photos[0].value,
        type: profile.provider
    });

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

express()
    .set('view engine', 'hbs')
    .use(express.json({
        limit: '32mb'
    }))
    .use(session({
        secret: nconf.get('SESSION_SECRET'),
        resave: false,
        saveUninitialized: false
    }))
    .use(express.static(publicDirectory))
    .use(passport.authenticate('session'))
    .get('/', async (request, response) => {
        if (request.user) {
            response.locals.user = await users.getAsync(
                request.user.id,
                'google');
        }

        response.render('post');
    })
    .post('/api/message', async (request, response) => {
        response.json(await messages.addAsync(request.body));
    })
    .get('/api/messages', async (request, response) => {
        const coordinates = {
            latitude: request.query.latitude,
            longitude: request.query.longitude
        };

        let user;

        if (request.user) {
            user = await users.getAsync(request.user.id, 'google');
        }

        response.json(await messages.getAsync(
            user,
            coordinates,
            request.query.accuracy));
    })
    .post('/api/like', async (request, response) => {
        if (!request.user) {
            response.sendStatus(403);

            return;
        }

        const user = await users.getAsync(request.user.id, 'google');

        await messages.likeAsync(user, request.body.id);

        response.sendStatus(200);
    })
    .post('/api/unlike', async (request, response) => {
        if (!request.user) {
            response.sendStatus(403);

            return;
        }

        const user = await users.getAsync(request.user.id, 'google');

        await messages.unlikeAsync(user, request.body.id);

        response.sendStatus(200);
    })
    .get('/auth/google', passport.authenticate('google', {
        scope: ['profile', 'email']
    }))
    .get('/auth/google/callback', passport.authenticate('google', {
        failureRedirect: '/login',
        successRedirect: '/'
    }))
    .post('/auth/sign-out', (request, response, next) => {
        request.logout(error => {
            if (error) {
                return next(error);
            }

            response.redirect('/');
        });
    })
    .listen(nconf.get('PORT') || 3000);
