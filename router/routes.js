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

Router.route('/', { name: 'home' });

Router.route('/hubs', {
  name: 'hub.list',
  waitOn: function() {
    return Meteor.subscribe("hubs");
  }
});

Router.route('/about', {
  name: 'about'
});

Router.route('/admin', {
  name: 'admin',
  controller: 'AdminController'
});

Router.route("/hub/create", {name: 'hub.create'});

Router.route('/hub/:_id', {
  name: 'hub.show',
  controller: 'HubController'
});

Router.route('/hub/:_id/edit', {
  name: 'hub.edit',
  controller: 'HubController'
});
