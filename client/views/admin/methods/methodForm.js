AutoForm.addHooks('methodForm', {
  onSuccess: function(){
    Router.go('method.list');
  }
});
