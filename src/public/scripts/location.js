// location.js
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

navigator.geolocation.getCurrentPosition(
    (position) => {
        console.log(position.coords.latitude);
        console.log(position.coords.longitude);
    },
    err => { throw err },
    { enableHighAccuracy: true });
