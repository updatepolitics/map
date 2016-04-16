AutoForm.addHooks('mechanismForm', {
  onSuccess: function(){
    Router.go('mechanism.list');
  }
});
