Template.signalEdit.onCreated(function (){
  this.subscribe('hubs');
  this.subscribe('signals');
  this.subscribe('incidencyTypes');
  this.subscribe('incidencyReachs');
  this.subscribe('origins');
  this.subscribe('purposes');
  this.subscribe('themes');
});

Template.signalEdit.helpers({
  originsOptions: function(){
    return Origins.find({}, {sort: {en: 1}}).map(function (c) {
      return {label: c.en, value: c._id};
    });
  },
  purposeOptions: function(){
    return Purposes.find({}, {sort: {en: 1}}).map(function (i) {
      return {label: i.en, value: i._id};
    });
  },
  themesOptions: function(){
    return Themes.find({}, {sort: {en: 1}}).map(function (i) {
      return {label: i.en, value: i._id};
    });
  },
  incidencyReachOptions: function(){
    return IncidencyReachs.find({}).map(function (i) {
      return {label: i.en, value: i._id};
    });
  },
  incidencyTypeOptions: function(){
    return IncidencyTypes.find({}).map(function (i) {
      return {label: i.en, value: i._id};
    });
  },
  hubsOptions: function(){
    return Hubs.find({}, {sort: {name: 1}}).map(function (h) {
      return {label: h.name, value: h._id};
    });
  },
  technologyType: function(){
    return _.map(['Digital', 'Social'], function (i) {
      return {label: i, value: i};
    });
  }
});
