Template.hubCreate.onCreated(function (){
  this.subscribe('hubs');
  this.subscribe('natures', {sort: {name: 1}});
  this.subscribe('origins');
  this.subscribe('incidencyReachs');
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
    return IncidencyReachs.find({}).map(function (i) {
      return {label: i.en, value: i._id};
    });
  }
});
