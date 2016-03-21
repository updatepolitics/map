Router.route('/', {
  name: 'hub.list',
  controller: 'HomeController'
});

Router.route('/about', {name: 'about'});

Router.route('/hub/:_id', {
  name: 'hub.show',
  controller: 'HubController'
});

Router.route('/hub/:_id/edit', {
  name: 'hub.edit',
  controller: 'HubController'
});
