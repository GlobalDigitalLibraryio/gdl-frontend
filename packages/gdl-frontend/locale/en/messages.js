module.exports = {
  languageData: {
    plurals: function(n, ord) {
      var s = String(n).split('.'),
        v0 = !s[1],
        t0 = Number(s[0]) == n,
        n10 = t0 && s[0].slice(-1),
        n100 = t0 && s[0].slice(-2);
      if (ord)
        return n10 == 1 && n100 != 11
          ? 'one'
          : n10 == 2 && n100 != 12
            ? 'two'
            : n10 == 3 && n100 != 13
              ? 'few'
              : 'other';
      return n == 1 && v0 ? 'one' : 'other';
    }
  },
  messages: {
    'Download book': 'Download book',
    'E-book (ePUB)': 'E-book (ePUB)',
    'Printable book (PDF)': 'Printable book (PDF)',
    '{value, plural, one {Author} other {Authors}}': function(a) {
      return [a('value', 'plural', { one: 'Author', other: 'Authors' })];
    },
    '{value, plural, one {Illustrator} other {Illustrators}}': function(a) {
      return [
        a('value', 'plural', { one: 'Illustrator', other: 'Illustrators' })
      ];
    },
    '{value, plural, one {Translator} other {Translators}}': function(a) {
      return [
        a('value', 'plural', { one: 'Translator', other: 'Translators' })
      ];
    },
    '{value, plural, one {Photographer} other {Photographers}}': function(a) {
      return [
        a('value', 'plural', { one: 'Photographer', other: 'Photographers' })
      ];
    },
    '{value, plural, one {Contributor} other {Contributors}}': function(a) {
      return [
        a('value', 'plural', { one: 'Contributor', other: 'Contributors' })
      ];
    },
    Published: 'Published',
    License: 'License',
    More: 'More',
    Dismiss: 'Dismiss',
    'Classroom books': 'Classroom books',
    'New arrivals': 'New arrivals',
    'Library books': 'Library books',
    'Book language': 'Book language',
    Categories: 'Categories',
    'Log in': 'Log in',
    'Log out': 'Log out',
    'My translations': 'My translations',
    'About the Global Digital Library': 'About the Global Digital Library',
    'Licensing and reuse': 'Licensing and reuse',
    'Cookie policy': 'Cookie policy',
    'Privacy policy': 'Privacy policy',
    'Report issues': 'Report issues',
    'Enjoy free reading resources. Available for everyone. Forever':
      'Enjoy free reading resources. Available for everyone. Forever',
    Featured: 'Featured',
    'Choose language': 'Choose language',
    'Selected:': 'Selected:',
    Change: 'Change',
    'Close menu': 'Close menu',
    Breadcrumb: 'Breadcrumb',
    Home: 'Home',
    'Library <0>books</0>': 'Library <0>books</0>',
    'Classroom <0>books</0>': 'Classroom <0>books</0>',
    Search: 'Search',
    'Sorry, you don\u2019t have access to this page':
      'Sorry, you don\u2019t have access to this page',
    'Take me home': 'Take me home',
    'Oh no!': 'Oh no!',
    'The page you were looking for was taken by a 404.':
      'The page you were looking for was taken by a 404.',
    Previous: 'Previous',
    Next: 'Next',
    'Close book': 'Close book',
    Decodable: 'Decodable',
    'Read aloud': 'Read aloud',
    'Level {level}': function(a) {
      return ['Level ', a('level')];
    },
    '<0>Oh no!</0> Please try searching for something else.':
      '<0>Oh no!</0> Please try searching for something else.',
    'Search for books.': 'Search for books.',
    'Login required. Please wait while we redirect you.':
      'Login required. Please wait while we redirect you.',
    Login: 'Login',
    'Log in to continue': 'Log in to continue',
    'Log in using Google': 'Log in using Google',
    'Log in using Facebook': 'Log in using Facebook',
    'Redirecting...': 'Redirecting...',
    'Logged in, please wait while we redirect you!':
      'Logged in, please wait while we redirect you!',
    'from {0}': function(a) {
      return ['from ', a('0')];
    },
    'Read book': 'Read book',
    'Translate this book': 'Translate this book',
    'Report a problem with this book': 'Report a problem with this book',
    Similar: 'Similar',
    'Translate book': 'Translate book',
    'Translate: {0}': function(a) {
      return ['Translate: ', a('0')];
    },
    'Translate from': 'Translate from',
    'Translate to': 'Translate to',
    'Start translation': 'Start translation',
    'Opens 3rd party site <0>Crowdin</0> in a new window.':
      'Opens 3rd party site <0>Crowdin</0> in a new window.',
    'Prepare translation': 'Prepare translation',
    'Browse books': 'Browse books',
    'No books found': 'No books found',
    'See more books': 'See more books',
    Sync: 'Sync',
    Edit: 'Edit',
    '{0, plural, one {# result for} other {# results for}}': function(a) {
      return [
        a('0', 'plural', {
          one: ['#', ' result for'],
          other: ['#', ' results for']
        })
      ];
    },
    'No results for <0>"{lastSearchQuery}"</0>': function(a) {
      return ['No results for <0>"', a('lastSearchQuery'), '"</0>'];
    },
    'See more': 'See more'
  }
};
