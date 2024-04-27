// post.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import { Toast } from 'bootstrap';
import { SpottedClient } from './spotted-client.js';

const client = new SpottedClient();

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);

function getToastContainer() {
    return document.getElementById('toastContainer');
}

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
    document
        .getElementById('postButton')
        .addEventListener('click', onPostButtonClick);
    getMessageTab().addEventListener('click', onMessageTabClick);
    getImageTab().addEventListener('click', onImageTabClick);
    getImageInput().addEventListener('input', onImageInputInput);

    for (const toast of document.querySelectorAll('.toast')) {
        Toast
            .getOrCreateInstance(toast, {
                autohide: false
            })
            .show();
    }

    navigator.geolocation.getCurrentPosition(async position => {
        const messages = await client.getMessagesAsync(
            position.coords,
            position.coords.accuracy);

        getToastContainer().innerHTML = '';

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
    const toast = document.createElement('div');
    const toastHeader = document.createElement('div');
    const toastBody = document.createElement('div');
    const profileImage = document.createElement('img');
    const strong = document.createElement('strong');
    const small = document.createElement('small');
    const time = document.createElement('time');
    const likeButton = document.createElement('button');
    const likeIcon = document.createElement('i');

    toast.classList.add('toast');
    toastHeader.classList.add('toast-header');
    toastBody.classList.add('toast-body');
    profileImage.classList.add('rounded');
    profileImage.classList.add('me-2');
    strong.classList.add('me-auto');
    likeButton.classList.add('btn');
    likeIcon.classList.add('bi');

    if (message.liked) {
        likeIcon.classList.add('bi-heart-fill');
    } else {
        likeIcon.classList.add('bi-heart');
    }

    if (message.user) {
        profileImage.src = message.user.imageURL;
        profileImage.alt = message.user.name;
        strong.textContent = message.user.name;
    } else {
        const random = Math.random();

        if (random < 0.25) {
            profileImage.src = "images/cool.png";
        } else if (random < 0.5) {
            profileImage.src = "images/grinning.png";
        } else if (random < 0.75) {
            profileImage.src = "images/happy.png";
        } else {
            profileImage.src = "images/laughing.png";
        }

        profileImage.width = 20;
        profileImage.height = 20;
        profileImage.alt = "Anonymous";
        strong.textContent = "Anonymous";
    }

    const posted = moment(message.posted);

    time.textContent = posted.fromNow();
    time.datetime - message.posted.toString();
    time.title = posted.format('MMM D, YYYY [at] h:mm');

    switch (message.type) {
        case 'image':
            {
                const image = document.createElement('img');

                image.src = message.content;
                image.width = 96;

                image.classList.add('rounded');
                toastBody.appendChild(image);
            }
            break;

        default:
            toastBody.textContent = message.content;
            break;
    }

    const id = message.id;

    toastHeader.appendChild(profileImage);
    toastHeader.appendChild(strong);
    small.appendChild(time);
    toastHeader.appendChild(small);
    likeButton.appendChild(likeIcon);
    toastHeader.appendChild(likeButton);
    toast.appendChild(toastHeader);
    toast.appendChild(toastBody);
    getToastContainer().appendChild(toast);
    likeButton.addEventListener(
        'click',
        async () => await onLikeButtonClick(likeIcon, id));
    toast.addEventListener(
        'dblclick',
        async () => await onLikeButtonClick(likeIcon, id));

    Toast
        .getOrCreateInstance(toast, {
            autohide: false
        })
        .show();
}

async function onLikeButtonClick(icon, id) {
    if (icon.classList.contains('bi-heart')) {
        await client.likeMessageAsync(id);

        icon.classList.remove('bi-heart');
        icon.classList.add('bi-heart-fill');
    } else {
        await client.unlikeMessageAsync(id);

        icon.classList.remove('bi-heart-fill');
        icon.classList.add('bi-heart');
    }
}
