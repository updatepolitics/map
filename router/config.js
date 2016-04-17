Router.configure({
  layoutTemplate: 'appLayout'
});

AccountsTemplates.configure({
    defaultLayout: 'adminLayout',
    onLogoutHook: function() {
      Router.go('/admin');
    }
});

AccountsTemplates.configureRoute('signIn', {
  path: '/admin',
  redirect: '/admin/hubs'
});

Router.route('/', { name: 'home' });
Router.route('/chart', { name: 'chart' });
Router.route('/about', { name: 'about' });
Router.route('/countries', { name: 'countries' });
Router.route('/hubs', { name: 'hubs' });
Router.route('/methodology', { name: 'methodology' });
Router.route('/signals', { name: 'signals' });

Router.plugin('ensureSignedIn', {
  except: ['home', 'admin']
});
