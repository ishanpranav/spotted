// socket-client.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import { io } from '/socket.io/socket.io.esm.min.js';

let socket;
let messagesTable;

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);

function onDOMContentLoaded() {
    socket = io();

    socket.on('posted', message => {
        addMessage(message.content);
    });

    const postButton = document.getElementById('postButton');

    messagesTable = document.getElementById('messagesTable');

    postButton.addEventListener('click', onPostButtonClick);
}

function onPostButtonClick() {
    const contentInput = document.getElementById('contentInput');

    socket.emit('post', {
        content: contentInput.value
    });
}

function addMessage(content) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');

    cell.textContent = content;

    row.appendChild(cell);
    messagesTable.appendChild(row);
    console.log('appendend')
}
