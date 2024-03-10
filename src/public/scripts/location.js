// location.js
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

navigator.geolocation.getCurrentPosition(
    async (position) => {
        window.location.href = 
            '/?latitude=' + position.coords.latitude + 
            '&longitude=' + position.coords.longitude + 
            '&accuracy=' + position.coords.accuracy;
    },
    err => { throw err },
    { enableHighAccuracy: true });
