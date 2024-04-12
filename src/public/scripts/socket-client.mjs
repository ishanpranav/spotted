import { io } from '/socket.io/socket.io.esm.min.js';

document.addEventListener('DOMContentLoaded', onDOMContentLoaded);

function onDOMContentLoaded() {
    const socket = io();

    socket.on('posted', data => {
        console.log(data);
    });
}
