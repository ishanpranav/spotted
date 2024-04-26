// app.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import './config.mjs'; // first

import express from 'express';
import session from 'express-session';
import passport from 'passport';
import { connect } from 'mongoose';
import { Strategy } from 'passport-google-oauth20';
import { dirname, join } from 'path';
import { fileURLToPath } from 'url';
import { MessageRepository } from './message-repository.mjs';
import { UserRepository } from './user-repository.mjs';

await connect(process.env.DSN);

const rootDirectory = dirname(fileURLToPath(import.meta.url));
const publicDirectory = join(rootDirectory, 'public');
const messages = new MessageRepository();
const users = new UserRepository();

passport.use(new Strategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
    console.log("Create user called ", profile);

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
        secret: process.env.SESSION_SECRET,
        resave: false,
        saveUninitialized: false
    }))
    .use(express.static(publicDirectory))
    .use(passport.authenticate('session'))
    .get('/', async (_, response) => {
        if (request.user) {
            response.locals.user = await users.getAsync(
                request.user.id, 
                'google');
        }
        
        response.render('post');
    })
    .post('/api/message', async (request, response) => {
        await messages.addAsync(request.body);

        response.sendStatus(200);
    })
    .get('/api/messages', async (request, response) => {
        const coordinates = {
            latitude: request.query.latitude,
            longitude: request.query.longitude
        };

        response.json(await messages.getAsync(
            coordinates,
            request.query.accuracy));
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
    .listen(process.env.PORT || 3000);
