Meteor.startup(function(){

  var isMobile =
    navigator.userAgent.match(/Android/i) ||
    navigator.userAgent.match(/BlackBerry/i) ||
    navigator.userAgent.match(/iPhone|iPad|iPod/i) ||
    navigator.userAgent.match(/Opera Mini/i) ||
    navigator.userAgent.match(/IEMobile/i);

  Session.set('isMobile', isMobile);

  // set defaults
  Session.set('currentContext', 'signals');
  Session.set('showPopup', false);
  Session.set('searchStr', '');
  Session.set('mapHelpIsOpen', 'false');

  // set user language
  var language = Session.get('language');
  if (language) TAPi18n.setLanguage(language);

  // init filter count
  Session.set('filterCount', JSON.stringify({
    signals: 0,
    hubs: 0
  }));

  // init filters by getting options from db
  var filters = Meteor.call('initFilters', function(err, results){
    if (err) console.log(err);
    else Session.set('filters', JSON.stringify(results));
  });
});
