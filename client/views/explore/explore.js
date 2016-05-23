Meteor.Spinner.options = {
  color: '#fff'
}

Template.explore.onCreated(function() {
  var self = this;

  /*
   * INIT EXPLORE CONFIG
   */

  var exploreConfig = {
    chartView: true,
    context: 'signals',
    filterCount: {
      signals: 0,
      hubs: 0
    }
  }

  /*
   * INIT FILTERS
   */

  var filters = {
    general: {
      placesOfOrigin: {},
      incidencyReach: {},
    },
    signals: {
      mainThemes: {},
      mechanisms: {},
      purpose: {},
      technologyType: {},
    },
    hubs: {
      nature: {},
      isSponsor: {
        'true': {
          _id: true,
          pt: 'Sim',
          selected: false
        },
        'false': {
          _id: false,
          pt: 'Não',
          selected: false
        }
      }
    }
  }

  var placesOfOrigin = [];

  var signals = [];
  Signals.find({}, {
    fields: {
      name: 1,
      placesOfOrigin: 1,
      incidencyReach: 1,
      mainThemes: 1,
      mechanisms: 1,
      purpose: 1,
      technologyType: 1
    }
  }).forEach(function(signal){
    signals.push(signal);
    placesOfOrigin = placesOfOrigin.concat(signal.placesOfOrigin);
  });
  exploreConfig.signals = signals;

  var hubs = [];
  Hubs.find({}, {
    fields: {
      name: 1,
      placesOfOrigin: 1,
      incidencyReach: 1,
      nature: 1,
      isSponsor: 1
    }
  }).forEach(function(hub){
    hubs.push(hub);
    placesOfOrigin = placesOfOrigin.concat(hub.placesOfOrigin);
  });
  exploreConfig.hubs = hubs;

  Origins
    .find({_id: {$in: _.uniq(placesOfOrigin)}})
    .forEach(function(i){
      i.selected = false;
      filters.general.placesOfOrigin[i._id] = i;
    });

  var placesOfOriginOptions = [];
  Origins
    .find({_id: {$in: _.uniq(placesOfOrigin)}})
    .forEach(function(i){
      i.selected = false;
      filters.general.placesOfOrigin[i._id] = i;
    });

  IncidencyReachs
    .find({})
    .forEach(function(i){
      i.selected = false;
      filters.general.incidencyReach[i._id] = i;
    });

  TechnologyTypes
    .find({})
    .forEach(function(i){
      i.selected = false;
      filters.signals.technologyType[i._id] = i;
    });

  Themes
    .find({})
    .forEach(function(i){
      i.selected = false;
      filters.signals.mainThemes[i._id] = i;
    });

  Mechanisms
    .find({})
    .forEach(function(i){
      i.selected = false;
      filters.signals.mechanisms[i._id] = i;
    });

  Purposes
    .find({})
    .forEach(function(i){
      i.selected = false;
      filters.signals.purpose[i._id] = i;
    });

  Natures
    .find({})
    .forEach(function(i){
      i.selected = false;
      filters.hubs.nature[i._id] = i;
    });

  exploreConfig.filters = filters;

  /*
   * Set labels
   */

  exploreConfig.signals = exploreConfig.signals.map(function(signal){
    signal.labels = {};
    signal.labels.purpose = exploreConfig.filters.signals.purpose[signal.purpose];
    signal.labels.incidencyReach = exploreConfig.filters.general.incidencyReach[signal.incidencyReach];
    signal.labels.placesOfOrigin = {
      en: '',
      es: '',
      pt: '',
    }

    if (signal.placesOfOrigin && signal.placesOfOrigin.length > 0) {
      var originsEn = [];
      var originsEs = [];
      var originsPt = [];
      _.each(signal.placesOfOrigin, function(o){
        originsEn.push(exploreConfig.filters.general.placesOfOrigin[o].en);
        originsEs.push(exploreConfig.filters.general.placesOfOrigin[o].es);
        originsPt.push(exploreConfig.filters.general.placesOfOrigin[o].pt);
      })
      signal.labels.placesOfOrigin.en = originsEn.join(', ');
      signal.labels.placesOfOrigin.es = originsEs.join(', ');
      signal.labels.placesOfOrigin.pt = originsPt.join(', ');
    }
    return signal;
  });

  exploreConfig.hubs = exploreConfig.hubs.map(function(hub){
    hub.labels = {};
    hub.labels.incidencyReach = exploreConfig.filters.general.incidencyReach[hub.incidencyReach];
    hub.labels.placesOfOrigin = {
      en: '',
      es: '',
      pt: '',
    }

    if (hub.placesOfOrigin && hub.placesOfOrigin.length > 0) {
      var originsEn = [];
      var originsEs = [];
      var originsPt = [];
      _.each(hub.placesOfOrigin, function(o){
        originsEn.push(exploreConfig.filters.general.placesOfOrigin[o].en);
        originsEs.push(exploreConfig.filters.general.placesOfOrigin[o].es);
        originsPt.push(exploreConfig.filters.general.placesOfOrigin[o].pt);
      })
      hub.labels.placesOfOrigin.en = originsEn.join(', ');
      hub.labels.placesOfOrigin.es = originsEs.join(', ');
      hub.labels.placesOfOrigin.pt = originsPt.join(', ');
    }
    return hub;
  });

  Session.set('exploreConfig', JSON.stringify(exploreConfig));
});


Template.explore.onRendered(function(){
  var self = this;

  // Bind 'esc' key to popup close
  $(document).keyup(function(e) {
    if (e.keyCode == 27) {
      e.preventDefault();
      Session.set('showPopup', false);
    }
  });
});


Template.explore.helpers({
  chartView: function() {
    var exploreConfig = JSON.parse(Session.get('exploreConfig'));
    return exploreConfig.chartView;
  },
  signalContext: function() {
    var exploreConfig = JSON.parse(Session.get('exploreConfig'));
    return (exploreConfig.context == 'signals') ? true : false;
  },
  showPopup: function(){
    var exploreConfig = JSON.parse(Session.get('exploreConfig'));
    return exploreConfig.showPopup || false;
  },
  popupContent: function() {
    var exploreConfig = JSON.parse(Session.get('exploreConfig'));
    var d = exploreConfig.popupContent;
    d.visible = (d.depth == 2) ? true : false;
    return d;
  }
});

Template.explore.events({
  "click #popup_x": function(event, template){
    var exploreConfig = JSON.parse(Session.get('exploreConfig'));
    exploreConfig.showPopup = false;
    Session.set('exploreConfig', JSON.stringify(exploreConfig));
  }
});
