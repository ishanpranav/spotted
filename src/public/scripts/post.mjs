// post.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import { io } from '/socket.io/socket.io.esm.min.js';
import { SpottedClient } from './spotted-client.mjs';

let socket;
const client = new SpottedClient();

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);

async function onDOMContentLoaded() {
    socket = io();

    socket.on('posted', message => {
        addMessage(message);
    });

    const postButton = document.getElementById('postButton');

    postButton.addEventListener('click', onPostButtonClick);

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

function addMessage(message) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');

    cell.textContent = message.content + " (" + message.distance + ")";

    row.appendChild(cell);
    document.getElementById('messagesTable').appendChild(row);
}
