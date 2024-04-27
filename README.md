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

- (2 points) **Use a user-interface framework.** I will use Bootstrap as the UI
  framework for the project. I will customize the color scheme.
- (2 points) **Use a CSS preprocessor.** I will use Sass to compile SCSS to CSS.
- (3 points) **Server-side JavaScript library: integrate user authentication.**
  I will use Passport for user authentication. Registered users should be able
  to sign in with Google.
- (3 points) **Configuration management.** I will use _nconf_ to manage secrets
  and the database connection string.

## References

1. [Geolocation API - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/Geolocation_API) -
    [post.mjs](src/public/scripts/post.mjs)
2. [Bootstrap documentation](https://getbootstrap.com/docs/5.3/) -
    [layout.hbs](src/views/layout.hbs)
3. [Haversine formula](https://en.wikipedia.org/wiki/Haversine_formula)
   - [Calculate geometric Euclidean distance](https://gist.github.com/manix/7ce097c73728e07178af74cb4c62a341) - [geometry.mjs](src/geometry.mjs)
4. [FileReader API - Web APIs | MDN](https://developer.mozilla.org/en-US/docs/Web/API/FileReader/readAsDataURL) -
    [post.mjs](src/public/scripts/post.mjs)
5. [Passport.js Documentation](https://www.passportjs.org/docs/) - [app.mjs](src/app.mjs)
6. [Moment.js Documentation](https://momentjs.com/) - [post.js](src/post.js)

## License

This repository is licensed under the [MIT](LICENSE.txt) license.

## Attribution

The logo and default icons for this project were designed by
[AoMam on Flaticon](https://www.flaticon.com/authors/aomam). Layouts and styles
are provided by [Bootstrap](https://getbootstrap.com/). This repository
redistributes [Moment.js](https://momentjs.com/) by Tim Wood, Iskren Chernev, and the Moment.js contributors. Moment.js is licensed under the MIT license.
