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
 * Hubs admin
 */

Router.route('admin/hubs', { name: 'hub.list' });
Router.route("admin/hubs/create", {name: 'hub.create'});
Router.route('admin/hubs/:_id/edit', {
  name: 'hub.edit',
  controller: 'HubController'
});

/*
 * Natures admin
 */
Router.route("admin/natures", { name: 'nature.list' });
Router.route('admin/natures/:_id/edit', {
  name: 'nature.edit',
  controller: 'NatureController'
});

/*
 * Signals admin
 */
Router.route("admin/signals", { name: 'signals.list' });

/*
 * Pages admin
 */
Router.route("admin/pages", { name: 'pages.list' });
