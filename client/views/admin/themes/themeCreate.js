Template.themeCreate.onCreated(function (){
  this.subscribe('themes', {sort: {name: 1}});
  this.subscribe('origins');
});

Template.themeCreate.helpers({
});
