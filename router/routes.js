Router.plugin('auth',{
  except: [
    'forgotPassword',
    'home',
    'login',
    'resetPassword',
    'signup',
    'verifyEmail',
    'hub.list',
    'hub.show'
  ]
});

Router.route('/', {
  name: 'hub.list',
  controller: 'HomeController'
});

Router.route('/about', {
  name: 'about'
});

Router.route('/admin', {
  name: 'admin',
  controller: 'AdminController'
});

Router.route('/hub/:_id', {
  name: 'hub.show',
  controller: 'HubController'
});

Router.route('/hub/:_id/edit', {
  name: 'hub.edit',
  controller: 'HubController'
});
