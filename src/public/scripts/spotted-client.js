// spotted-client.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

/**
 * Provides a wrapper for the spotted messages application-programming
 * interface.
 */
export class SpottedClient {
    /** Initializes a new instance of the `SpottedClient` class. */
    constructor() { }

    /**
     * Asynchronously gets all messages available at the given location.
     * 
     * @param {*} coordinates the coordinates of the location.
     * @param {*} accuracy    the accuracy of the specified coordinates.
     * @return {Promise} a promise whose result contains the collection of
     *                   messages available at the given location.
     */
    async getMessagesAsync(coordinates, accuracy) {
        const request = `/api/messages?latitude=${coordinates.latitude}` +
            `&longitude=${coordinates.longitude}` +
            `&accuracy=${accuracy}`;
        const response = await fetch(request);

        return await response.json();
    }

    /**
     * Asynchronously adds a message.
     * 
     * @param {*} message the message to add.
     * @returns {Promise} A promise representing the asynchronous add operation.
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
