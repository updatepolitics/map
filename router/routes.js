Router.plugin('auth',{
  except: [
    'forgotPassword',
    'home',
    'login',
    'resetPassword',
    'signup',
    'verifyEmail',
    'hub.list'
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
  name: 'hub.list',
  waitOn: function() {
    return Meteor.subscribe("hubs");
  }
});

Router.route("admin/hubs/create", {name: 'hub.create'});

Router.route('admin/hubs/:_id/edit', {
  name: 'hub.edit',
  controller: 'HubController'
});

Router.route("admin/signals", { name: 'signals.list' });
Router.route("admin/natures", { name: 'natures.list' });
Router.route("admin/pages", { name: 'pages.list' });
