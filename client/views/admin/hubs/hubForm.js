Template.hubForm.onCreated(function (){
  this.subscribe('hubs');
  this.subscribe('natures');
  this.subscribe('origins');
  this.subscribe('incidencyReachs');
});

Template.hubForm.helpers({
  formType: function(){
    if(_.isEmpty(this)) {
      return 'insert'
    } else {
      return 'update';
    }
  }
});

AutoForm.addHooks('hubForm', {
  onSuccess: function(){
    Router.go('hub.list');
  }
});
