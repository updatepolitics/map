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
