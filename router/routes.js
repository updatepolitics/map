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
 * Signals admin
 */

Router.route('admin/signals', { name: 'signal.list' });
Router.route("admin/signals/create", {name: 'signal.create'});
Router.route('admin/signals/:_id/edit', {
  name: 'signal.edit',
  controller: 'SignalController'
});

/*
 * Natures admin
 */
Router.route("admin/natures/create", {name: 'nature.create'});
Router.route("admin/natures", { name: 'nature.list' });
Router.route('admin/natures/:_id/edit', {
  name: 'nature.edit',
  controller: 'NatureController'
});

/*
 * Themes admin
 */
Router.route("admin/themes/create", {name: 'theme.create'});
Router.route("admin/themes", { name: 'theme.list' });
Router.route('admin/themes/:_id/edit', {
  name: 'theme.edit',
  controller: 'ThemeController'
});

/*
 * Mechanisms admin
 */
Router.route("admin/mechanisms/create", {name: 'mechanism.create'});
Router.route("admin/mechanisms", { name: 'mechanism.list' });
Router.route('admin/mechanisms/:_id/edit', {
  name: 'mechanism.edit',
  controller: 'MechanismController'
});

/*
 * Methods admin
 */
Router.route("admin/methods/create", {name: 'method.create'});
Router.route("admin/methods", { name: 'method.list' });
Router.route('admin/methods/:_id/edit', {
  name: 'method.edit',
  controller: 'MethodController'
});

/*
 * Pages admin
 */
Router.route("admin/pages", { name: 'pages.list' });
