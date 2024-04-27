// message-repository.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import { haversineDistance } from './geometry.mjs';
import { Message } from './message.mjs';

/** Provides a repository for messages. */
export class MessageRepository {
    /** Initializes a new instance of the `MessageRepository` class. */
    constructor() { }

    /**
     * Asynchronously adds a message.
     * 
     * @param {*} message the message to add.
     * @returns {Promise} A promise representing the asynchronous add operation.
     */
    async addAsync(message) {
        message.content = message.content.trim();

        if (!message.content.length) {
            return;
        }

        await new Message(message).save();
    }

    /**
     * Asynchronously gets all messages available at the given location.
     * 
     * @param {*} coordinates the coordinates of the location.
     * @param {*} accuracy    the accuracy of the specified coordinates.
     * @return {Promise} a promise whose result contains the collection of
     *                   messages available at the given location.
     */
    async getAsync(coordinates, accuracy) {
        const messages = await Message
            .find()
            .populate('user')
            .sort([['posted', -1]])
            .exec();

        const theta = Math.max(50, accuracy);
        const results = [];

        for (const message of messages) {
            const distance = haversineDistance(
                coordinates,
                message.coordinates);

            console.log(distance);

            if (distance > theta) {
                continue;
            }

            const result = {
                content: message.content,
                type: message.type,
                distance: distance,
                posted: message.posted
            };

            if (message.user) {
                result.user = {
                    name: message.user.name,
                    imageURL: message.user.imageURL
                };
            }

            results.push(result);
        }

        return results;
    }
}
