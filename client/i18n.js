Meteor.startup(function () {
  headers.ready(function() {
    var acceptLanguage = headers.get('accept-language');
    var acceptedLanguages = [];

    _.each(['pt', 'es', 'en'], function(language){
      var index = acceptLanguage.indexOf(language);
      if (index > -1) acceptedLanguages.push({language: language, index: index});
    });

    acceptedLanguages = _.sortBy(acceptedLanguages, function(l){ return l.index });

    if (acceptedLanguages.length > 0) return TAPi18n.setLanguage(acceptedLanguages[0].language);
    else return TAPi18n.setLanguage('en');
  });

});
