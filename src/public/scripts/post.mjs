// post.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import { io } from '/socket.io/socket.io.esm.min.js';
import { SpottedClient } from './spotted-client.mjs';

let socket;
const client = new SpottedClient();

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);

function getMessageTab() {
    return document.getElementById('messageTab');
}

function getImageTab() {
    return document.getElementById('imageTab');
}

function getMessageTabPage() {
    return document.getElementById('messageTabPage');
}

function getImageTabPage() {
    return document.getElementById('imageTabPage');
}

async function onDOMContentLoaded() {
    socket = io();

    socket.on('posted', message => {
        addMessage(message);
    });

    document
        .getElementById('postButton')
        .addEventListener('click', onPostButtonClick);
    getMessageTab().addEventListener('click', onMessageTabClick);
    getImageTab().addEventListener('click', onImageTabClick);

    navigator.geolocation.getCurrentPosition(async position => {
        const messages = await client.getMessagesAsync(
            position.coords,
            position.coords.accuracy);

        for (const message of messages) {
            addMessage(message);
        }

        console.log(position.coords);
    });
}

function onPostButtonClick() {
    const content = document.getElementById('contentInput').value;

    if (!content.trim().length) {
        return;
    }

    navigator.geolocation.getCurrentPosition(async position => {
        const message = {
            content: content,
            coordinates: {
                latitude: position.coords.latitude,
                longitude: position.coords.longitude
            },
            distance: 0
        };

        if (await client.addMessageAsync(message)) {
            socket.emit('post', message);
            addMessage(message);
        }

        console.log(position.coords);
    });
}

function onMessageTabClick() {
    getMessageTab().classList.add('active');
    getImageTab().classList.remove('active');
    getMessageTabPage().classList.remove('d-none');
    getImageTabPage().classList.add('d-none');
}

function onImageTabClick() {
    getMessageTab().classList.remove('active');
    getImageTab().classList.add('active');
    getMessageTabPage().classList.add('d-none');
    getImageTabPage().classList.remove('d-none');
}

function addMessage(message) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');

    cell.textContent = message.content + " (" + message.distance + ")";

    row.appendChild(cell);
    document.getElementById('messagesTable').appendChild(row);
}
