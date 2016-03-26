Template.hubEdit.onCreated(function (){
  this.subscribe('countries');
});

Template.hubEdit.helpers({
  countryOptions: function(){

    return Countries.find({}, {sort: {en: 1}}).map(function (c) {
      return {label: c.en, value: c._id};
    });

  }
});
