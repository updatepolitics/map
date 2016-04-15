Router.plugin('auth',{
  except: [
    'forgotPassword',
    'home',
    'login',
    'resetPassword',
    'signup',
    'signin',
    'verifyEmail',
    'hub.list'
  ]
});

Router.route('/', { name: 'home' });
Router.route('/chart', { name: 'chart' });
Router.route('/about', { name: 'about' });
Router.route('/countries', { name: 'countries' });
Router.route('/hubs', { name: 'hubs' });
Router.route('/methodology', { name: 'methodology' });
Router.route('/signals', { name: 'signals' });

Router.route('/admin', function(){
  this.redirect('/admin/hubs');
});

/*
 * Hubs admin
 */

Router.route('admin/hubs', {
  controller: 'AdminController',
  name: 'hub.list'
});
Router.route("admin/hubs/create", {
  controller: 'AdminController',
  template: 'hubForm',
  name: 'hub.create'
});

Router.route('admin/hubs/:_id/edit', {
  controller: 'HubController',
  template: 'hubForm',
  name: 'hub.edit'
});

/*
 * Signals admin
 */

Router.route('admin/signals', {
  controller: 'AdminController',
  name: 'signal.list'
});
Router.route("admin/signals/create", {
  controller: 'AdminController',
  template: 'signalForm',
  name: 'signal.create'
});
Router.route('admin/signals/:_id/edit', {
  controller: 'AdminController',
  template: 'signalForm',
  name: 'signal.edit',
  waitOn: function(){
    return Meteor.subscribe('signal', this.params._id);
  },
  data: function(){
    return Signals.findOne({
      _id: this.params._id
    });
  }
});

/*
 * Natures admin
 */
Router.route("admin/natures/create", {
  controller: 'AdminController',
  name: 'nature.create'
});
Router.route("admin/natures", {
  controller: 'AdminController',
  name: 'nature.list'
});
Router.route('admin/natures/:_id/edit', {
  controller: 'AdminController',
  name: 'nature.edit'
});

/*
 * Themes admin
 */
Router.route("admin/themes/create", {
  controller: 'AdminController',
  name: 'theme.create'
});
Router.route("admin/themes", {
  controller: 'AdminController',
  name: 'theme.list'
});
Router.route('admin/themes/:_id/edit', {
  controller: 'AdminController',
  name: 'theme.edit'
});

/*
 * Mechanisms admin
 */
Router.route("admin/mechanisms/create", {
  controller: 'AdminController',
  name: 'mechanism.create'
});
Router.route("admin/mechanisms", {
  controller: 'AdminController',
  name: 'mechanism.list'
});
Router.route('admin/mechanisms/:_id/edit', {
  controller: 'AdminController',
  name: 'mechanism.edit'
});

/*
 * Methods admin
 */
Router.route("admin/methods/create", {
  controller: 'AdminController',
  name: 'method.create'
});
Router.route("admin/methods", {
  controller: 'AdminController',
  name: 'method.list'
});
Router.route('admin/methods/:_id/edit', {
  controller: 'AdminController',
  name: 'method.edit'
});

/*
 * Pages admin
 */
Router.route("admin/pages", {
  controller: 'AdminController',
  name: 'pages.list'
});
