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

## Wireframes

There are just two pages - the main chat homepage (`/`) and the sign-in page
(`/sign-in`).

![Wireframe](docs/wireframe.png "Wireframe")

## Site map

The page heirarchy is as simple as possible: just the main single-page
application plus a sign-in area.

![Sitemap](docs/sitemap.png "Sitemap")

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

- (2 points) **Use a CSS framework.** I will use the Bootstrap CSS framework and
  customize the themes using Sass variables. Bootstrap is a frontend CSS and
  JavaScript framework that will ease the burden of creating custom styles. It
  ensures responsive, friendly rendering on desktop and mobile devices.
- (3 points) **Use build tools.** I will use Webpack to compile Sass. Webpack
  compiles (or rather tanspiles) code from higher-level web languages to
  lower-level ones. Since Bootstrap is written in Sass, customizing the theme
  variables will require Webpack's Sass support.
- (2 points) **Integrate ESLint into your workflow.** I will integrate ESLint
  into the workflow using Webpack to automate linting. Since I am already using
  Webpack, I can add ESLint as a build step. This enforces code style throughout
  the development process.
- (2 points) **Use a CSS preprocessor.** In order to customize Bootstrap, I will
  need a Sass preprocessor. As mentioned above, I'll use Webpack. Thus, Sass,
  ESLint, and Webpack will be one process.
- (remaining 1 point) **Server-side JavaScript library.** I will use Passport
  for user authentication. The application requires authentication, and I'd
  rather use a third-party service than create an email-based handwritten
  version. At minimum, I plan to support Google accounts but may expand to
  Microsoft, GitHub, and other services.

## Initial prototype

Please see [app.mjs](src/app.mjs), [location.js](src/public/scripts), and the
[views](src/views/) folder.

## References

1. [Geolocation API - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) -
    [location.js](src/location.js)
