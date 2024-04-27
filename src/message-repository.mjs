// message-repository.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import { haversineDistance } from './geometry.mjs';
import { Message } from './message.mjs';

/**  */
export class MessageRepository {
    /** Initializes a new instance of the `MessageRepository` class. */
    constructor() { }

    /**
     * 
     * @param {*} message 
     * @returns 
     */
    async addAsync(message) {
        message.content = message.content.trim();

        if (!message.content.length) {
            return;
        }

        await new Message(message).save();
    }

    /**
     * 
     * @param {*} coordinates 
     * @param {*} accuracy 
     */
    async getAsync(coordinates, accuracy) {
        const messages = await Message.find().populate('user');
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
                timestamp: message.timestamp
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
