// message.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

import { Schema, model } from 'mongoose';

/** Represents a posted message. */
export const Message = model('Message', new Schema({ 
    content: String,
    coordinates: {
        latitude: Number,
        longitude: Number,
        accuracy: Number
    },
    posted: Date
}));
