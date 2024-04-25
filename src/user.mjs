// user.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT License.

import { Schema, model } from 'mongoose';

/** Represents a reigstered user. */
export const User = model('User', new Schema({
    accountId: String,
    name: String,
    imageUrl: String,
    type: String
}));
