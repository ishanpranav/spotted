// location.js
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

function success(pos) {
    console.log(`Latitude : ${pos.coords.latitude}`);
    console.log(`Longitude: ${pos.coords.longitude}`);
    console.log(`Accuracy: ${pos.coords.accuracy} meters.`);
}

function error(err) {
    throw err;
}

navigator.geolocation.getCurrentPosition(success, error, {
    enableHighAccuracy: true
});
