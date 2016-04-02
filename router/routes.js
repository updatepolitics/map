Router.plugin('auth',{
  except: [
    'forgotPassword',
    'home',
    'login',
    'resetPassword',
    'signup',
    'verifyEmail',
    'hubs.list',
    'hubs.show'
  ]
});

Router.route('/', { name: 'home' });
Router.route('/about', { name: 'about' });
Router.route('/countries', { name: 'countries' });
Router.route('/hubs', { name: 'hubs' });
Router.route('/methodology', { name: 'methodology' });
Router.route('/signals', { name: 'signals' });

/*
 * Admin routes
 */

Router.route('admin/hubs', {
  name: 'hubs.list',
  waitOn: function() {
    return Meteor.subscribe("hubs");
  }
});

Router.route("admin/hubs/create", {name: 'hubs.create'});

Router.route('admin/hubs/:_id/edit', {
  name: 'hubs.edit',
  controller: 'HubController'
});

Router.route("admin/signals", { name: 'signals.list' });
Router.route("admin/natures", { name: 'natures.list' });
Router.route("admin/pages", { name: 'pages.list' });
