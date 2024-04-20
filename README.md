<!-- README.md -->
<!-- Copyright (c) 2024 Ishan Pranav -->
<!-- Licensed under the MIT license. -->

# Spotted

## Overview

Take **Spotted** everywhere you go - whether you're traveling or just hanging
around on campus. You'll be able to leave short notes so that anyone who visits
the same spot can read them.

Were you the first person to climb Mount Everest? How will anyone believe you if
you don't leave a note there for the next person!? Or maybe you went to an
absolutely _terrible_ food truck... leave a note behind to save anyone else who
stumbles across it!

Graffiti-up the world with your anonymous notes or sign in to react to other
notes. The ones with the best reactions stick around for others to see, while
the rest gradually vanish.

## Data model

The application only stores _registered users_ and _messages_. Each registered
user may be associated with many messages.

### Sample user

Users who want to interact with messages will sign in using a third-party
provider like Google or Microsoft. The users collection just associates a user
identifier with the third-party account information.

```javascript
{
  id: // user id
  account: // third-party sign-in account id
  imageUrl: // third-party sign-in user profile picture
}
```

### Sample message

Text messages ("notes") and their locations of origin ("spots") are stored in
the database.

In this example, the position is only accurate to 55 meters, which will be taken
into account when determining the radius in which others can see this message.

```javascript
{
  user: // a reference to a User object or a null (anonymous) user
  content: "Mark was here!",
  coordinates: {
    latitude: 40.738584,
    longitude: -74.003851,
    accuracy: 55
  },
  posted: // timestamp
}
```

### Schemata

See [user.mjs](src/user.mjs) for the first-draft user schema and
[message.mjs](src/message.mjs) for the first-draft message schema.

## Details

### Roles

- **User:** a generic role for any agent able to access the site.
- **Registered user**: a user with a registered account.
- **Non-registered user**: a user that has not signed into a registered account.

### User stories

1. As a non-registered user, I can register for a new account with the site
   using my Google account.
2. As a registered user, I can log into the site.
3. As a user, I can write a note anonymously.
4. As a registered user, I can write a note and claim authorship.
5. As a user, I can read notes that were written near my current location.
6. As a registered user, I can react to notes.

## Research topics

- (2 points) **Use a CSS framework.** I will use Bootstrap as the UI framework
  for the project. I will customize the styles using Sass.
- (3 points) **Use build tools.** I will use Webpack to compile Sass to CSS.
  This is required in order to customize Bootstrap.
- (2 points) **Integrate ESLint into your workflow.** I will integrate ESLint
  into the workflow using Webpack to automate linting. Since I am already using
  Webpack, I can add ESLint as a build step. This enforces code style throughout
  the development process.
- (3 points) **Server-side JavaScript library: integrate user authentication.**
  I will use Passport for user authentication. Registered users should be able
  to sign in with Google.

## Initial prototype

Please see [app.mjs](src/app.mjs), [location.js](src/public/scripts), and the
[views](src/views/) folder.

## References

1. [Geolocation API - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) -
    [post.mjs](src/public/scripts/post.mjs)
2. [Bootstrap documentation](https://getbootstrap.com/docs/5.3/) -
    [layout.hbs](src/views/layout.hbs)
3. [Haversine formula](https://en.wikipedia.org/wiki/Haversine_formula)
   - [Calculate geometric Euclidean distance](https://gist.github.com/manix/7ce097c73728e07178af74cb4c62a341) - [geometry.mjs](src/geometry.mjs)
