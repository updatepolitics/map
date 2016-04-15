Router.configure({
  layoutTemplate: 'appLayout'
});

AccountsTemplates.configure({
  defaultLayout: 'authLayout',
  onLogoutHook: function() {
    Router.go('/login');
  }
});

AccountsTemplates.configureRoute('signIn', {
    name: 'signin',
    path: '/login',
    template: 'login',
    layoutTemplate: 'authLayout',
    redirect: '/admin',
});
