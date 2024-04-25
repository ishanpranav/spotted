// spotted-client.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

/** */
export class SpottedClient {
    /** Initializes a new instance of the `SpottedClient` class. */
    constructor() { }

    /**
     * 
     * @param {*} coordinates 
     * @param {*} accuracy 
     * @returns 
     */
    async getMessagesAsync(coordinates, accuracy) {
        const request = `/api/messages?latitude=${coordinates.latitude}` +
            `&longitude=${coordinates.longitude}` +
            `&accuracy=${accuracy}`;
        const response = await fetch(request);

        return await response.json();
    }

    /**
     * 
     * @param {*} message 
     * @returns 
     */
    async addMessageAsync(message) {
        const response = await fetch('/api/message', {
            method: 'post',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(message)
        });

        return response.ok;
    }
}
