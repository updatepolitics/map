Template.signalForm.onCreated(function (){
  this.subscribe('hubs');
  this.subscribe('signals');
  this.subscribe('incidencyTypes');
  this.subscribe('incidencyReachs');
  this.subscribe('origins');
  this.subscribe('purposes');
  this.subscribe('methods');
  this.subscribe('themes');
});

AutoForm.addHooks('signalForm', {
  onSuccess: function(){
    Router.go('signal.list');
  }
});
