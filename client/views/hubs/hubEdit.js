Template.hubEdit.onCreated(function (){
  this.subscribe('natures');
  this.subscribe('countries');
});

Template.hubEdit.helpers({
  countryOptions: function(){
    return Countries.find({}, {sort: {en: 1}}).map(function (c) {
      return {label: c.en, value: c._id};
    });
  },
  natureOptions: function(){
    return Natures.find({}, {sort: {en: 1}}).map(function (n) {
      return {label: n.en, value: n._id};
    });
  },
  incidencyReachOptions: function(){
    return _.map(['Local', 'National', 'Regional', 'International'], function (i) {
      return {label: i, value: i};
    });
  }
});
