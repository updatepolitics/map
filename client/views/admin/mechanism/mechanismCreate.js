Template.mechanismCreate.onCreated(function (){
  this.subscribe('mechanisms', {sort: {name: 1}});
});
