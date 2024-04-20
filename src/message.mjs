// message.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

import { Schema, Types, model } from 'mongoose';

/** Represents a posted message. */
export const Message = model('Message', new Schema({
    user: {
        type: Types.ObjectId,
        ref: 'User'
    },
    content: String,
    coordinates: {
        latitude: Number,
        longitude: Number
    },
    posted: Date,
    type: String
}));
