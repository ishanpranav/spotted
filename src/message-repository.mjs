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
     * Asynchronously gets all messages available to the given user at the
     * given location.
     * 
     * @param {*} user        the user.
     * @param {*} coordinates the coordinates of the location.
     * @param {*} accuracy    the accuracy of the specified coordinates.
     * @return {Promise} a promise whose result contains the collection of
     *                   messages available at the given location.
     */
    async getAsync(user, coordinates, accuracy) {
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
                id: message._id,
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

            if (user && message.likes.indexOf(user._id) != -1) {
                result.liked = true;
            }

            results.push(result);
        }

        return results;
    }

    /**
     * Asynchronously adds a like to a message.
     * 
     * @param {*} user the user.
     * @param {*} id   the message identifier.
     * @return {Promise} A promise representing the asynchronous like operation.
     */
    async likeAsync(user, id) {
        console.log("user ", user, "likes message ", id);
    }

    /**
     * Asynchronously removes a like from a message.
     * 
     * @param {*} user the user.
     * @param {*} id   the message identifier.
     * @return {Promise} A promise representing the asynchronous unlike
     *                   operation.
     */
    async unlikeAsync(user, id) {
        console.log("user ", user, "unlikes message ", id);
    }
}
