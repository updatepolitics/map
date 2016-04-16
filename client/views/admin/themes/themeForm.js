AutoForm.addHooks('themeForm', {
  onSuccess: function(){
    Router.go('theme.list');
  }
});
