// socket-client.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import { io } from '/socket.io/socket.io.esm.min.js';

let socket;

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);

async function onDOMContentLoaded() {
    socket = io();

    socket.on('posted', message => {
        addMessage(message.content);
    });

    const postButton = document.getElementById('postButton');

    postButton.addEventListener('click', onPostButtonClick);

    navigator.geolocation.getCurrentPosition(async position => {
        const request = `/api/messages?latitude=${position.coords.latitude}` +
            `&longitude=${position.coords.longitude}` +
            `&accuracy=${position.coords.accuracy}`;
        const response = await fetch(request);
        const messages = await response.json();

        for (const message of messages) {
            addMessage(message.content);
        }
    });
}

async function onPostButtonClick() {
    const message = {
        content: document.getElementById('contentInput').value
    };
    const response = await fetch('/api/message', {
        method: 'post',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(message)
    });

    if (response.ok) {
        socket.emit('post', message);
        addMessage(message.content);
    }
}

function addMessage(content) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');

    cell.textContent = content;

    row.appendChild(cell);
    document.getElementById('messagesTable').appendChild(row);
}
