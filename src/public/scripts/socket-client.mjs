// socket-client.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import { io } from '/socket.io/socket.io.esm.min.js';

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);

let socket;

function onDOMContentLoaded() {
    socket = io();

    socket.on('posted', data => {
        console.log(data);
    });

    const postButton = document.getElementById('postButton');

    postButton.addEventListener('click', onPostButtonClick);
}

function onPostButtonClick() {
    socket.emit('post', {
        data: 2
    });
    console.log('post-ing')
}
