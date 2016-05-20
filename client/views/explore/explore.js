Meteor.Spinner.options = {
  color: '#fff'
}

Template.explore.onCreated(function() {
  var self = this;

  /*
   * FILTERS SETUP
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

  // avoid huge list of origins
  var placesOfOrigin = [];
  Signals.find({}, {
    fields: {
      placesOfOrigin: true
    }
  }).forEach(function(signal){
    placesOfOrigin =
      placesOfOrigin.concat(signal.placesOfOrigin);
  });

  Hubs.find({}, {
    fields: {
      placesOfOrigin: true
    }
  }).forEach(function(hub){
    placesOfOrigin =
      placesOfOrigin.concat(hub.placesOfOrigin);
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

  var exploreConfig = {
    chartView: true,
    context: 'signals',
    filterCount: {
      signals: 0,
      hubs: 0
    },
    filters: filters
  }

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
