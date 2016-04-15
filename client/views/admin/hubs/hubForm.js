Template.hubForm.onCreated(function (){
  this.subscribe('hubs');
  this.subscribe('natures');
  this.subscribe('origins');
  this.subscribe('incidencyReachs');
});

AutoForm.addHooks('hubForm', {
  onSuccess: function(){
    Router.go('hub.list');
  }
});
