Meteor.startup(function(){

  // set defaults
  Session.set('currentContext', 'signals');
  Session.set('showPopup', false);
  Session.set('searchStr', '');

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
