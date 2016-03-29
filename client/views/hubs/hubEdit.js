Template.hubEdit.onCreated(function (){
  this.subscribe('natures', {sort: {name: 1}});
  this.subscribe('origins');
});

Template.hubEdit.helpers({
  originsOptions: function(){
    return Origins.find({}, {sort: {en: 1}}).map(function (c) {
      return {label: c.en, value: c._id};
    });
  },
  natureOptions: function(){
    return _.map(['Academy', 'Company','Constellation','Government','Informal','Multitalteral','NGO','Party'], function (i) {
      return {label: i, value: i};
    });
  },
  incidencyReachOptions: function(){
    return _.map(['Local', 'National', 'Regional', 'International'], function (i) {
      return {label: i, value: i};
    });
  }
});
