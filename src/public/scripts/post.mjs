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

function getImageInput() {
    return document.getElementById('imageInput');
}

function getPictureBox() {
    return document.getElementById('pictureBox');
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
    getImageInput().addEventListener('input', onImageInputInput);

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
    const message = {};

    if (getImageTab().classList.contains('active')) {
        postImage(message);
    } else {
        postMessage(message);
    }
}

function confirmPost(message) {
    navigator.geolocation.getCurrentPosition(async position => {
        message.coordinates = {
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
        };

        if (await client.addMessageAsync(message)) {
            socket.emit('post', message);
            addMessage(message);
        }

        console.log(position.coords);
    });
}

function postMessage(message) {
    message.content = document.getElementById('contentInput').value;

    if (!message.content.trim().length) {
        return;
    }

    confirmPost(message);
}

function postImage(message) {
    const file = getImageInput().files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.addEventListener('load', () => {
        message.content = reader.result;
        message.type = 'image';

        confirmPost(message);
    });
    reader.readAsDataURL(file);
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

function onImageInputInput(e) {
    const file = e.target.files[0];

    if (!file) {
        return;
    }

    const reader = new FileReader();

    reader.addEventListener('load', () => {
        getPictureBox().src = reader.result;
    });
    reader.readAsDataURL(file);
}

function addMessage(message) {
    const row = document.createElement('tr');
    const cell = document.createElement('td');

    console.log(message.type)
    switch (message.type) {
        case 'image':
            const image = document.createElement('img');

            image.src = message.content;
            image.width = 96;
            image.classList.add('img-thumbnail');

            cell.appendChild(image);
            break;

        default:
            cell.textContent = message.content + " (" + message.distance + "m)";
            break;
    }

    row.appendChild(cell);
    document.getElementById('messagesTable').appendChild(row);
}
