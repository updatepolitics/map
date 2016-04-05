Template.hubCreate.onCreated(function (){
  this.subscribe('hubs');
  this.subscribe('natures', {sort: {name: 1}});
  this.subscribe('origins');
});

Template.hubCreate.helpers({
  originsOptions: function(){
    return Origins.find({}, {sort: {en: 1}}).map(function (c) {
      return {label: c.en, value: c._id};
    });
  },
  hubsOptions: function(){
    var result = [];
    Hubs.find({}, {sort: {name: 1}, fields: {name: 1}}).forEach(function (h) {
      result.push({label: h.name, value: h._id});
    });
    return result;
  },
  natureOptions: function(){
    return Natures.find({}, { sort: {en: 1} }).map(function (n) {
      return {label: n.en, value: n._id};
    });
  },
  incidencyReachOptions: function(){
    return _.map(['Local', 'National', 'Regional', 'International'], function (i) {
      return {label: i, value: i};
    });
  }
});
