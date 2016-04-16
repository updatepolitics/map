AutoForm.addHooks('natureForm', {
  onSuccess: function(){
    Router.go('nature.list');
  }
});
