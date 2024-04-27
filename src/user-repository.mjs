// user-repository.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import { User } from './user.mjs';

/** Provides a repository for registered users. */
export class UserRepository {
    /** Initializes a new instance of the `UserRepository` class. */
    constructor() { }

    /**
     * Asynchronously registers a user.
     * 
     * @param {*} user the user to register.
     * @returns {Promise} A promise representing the asynchronous add operation.
     */
    async addAsync(user) {
        await new User(user).save();
    }

    /**
     * Asynchronously gets all messages available at the given location.
     * 
     * @param {*} accountId the account identifier.
     * @param {*} type      the account type. Only `'google'` is supported.
     * @returns {Promise} a promise whose result contains the user of the
     *                    specified type with the given account identifier.
     */
    async getAsync(accountId, type) {
        return await User.findOne({ 
            accountId: accountId,
            type: type
        });
    }
}
