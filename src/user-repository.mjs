// user-repository.mjs
// Copyright (c) 2024 Ishan Pranav
// Licensed under the MIT license.

import { User } from './user.mjs';

/**  */
export class UserRepository {
    /** Initializes a new instance of the `UserRepository` class. */
    constructor() { }

    /**
     * 
     * @param {*} message 
     * @returns 
     */
    async addAsync(user) {
        await new User(user).save();
    }

    /**
     * 
     * @param {*} accountId
     * @param {*} type 
     * @returns 
     */
    async getAsync(accountId, type) {
        return await User.findOne({ 
            accountId: accountId,
            type: type
        });
    }
}
