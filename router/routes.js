Router.route('/', {
  name: 'home',
  controller: 'HomeController'
});

Router.route('/about', {name: 'about'});

Router.route('/hub/:_id', {
  name: 'hub.show',
  controller: 'HubController'
});
