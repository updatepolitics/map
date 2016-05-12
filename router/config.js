/*
 * Default layout
 */

Router.configure({
  layoutTemplate: 'appLayout'
});

/*
 * Home route
 */

Router.route("/", {name: "home"});

/*
 * Static pages routes
 */

Router.route("/about", {name: "about"});
Router.route("/mapping", { name: "mapping" });
Router.route("/countries", {name: "countries"});

/*
 * Hubs routes
 */

Router.route("/hubs", {
  name: "hubs",
  waitOn: function() {
    return [
      Meteor.subscribe('natures')
    ];
  }
});

Router.route("/hub/:_id", {
  name: "hub",
  template: "hubDetail",
  waitOn: function(){
    return [
      Meteor.subscribe('origins'),
      Meteor.subscribe('purposes'),
      Meteor.subscribe('incidencyTypes'),
      Meteor.subscribe('incidencyReachs'),
      Meteor.subscribe('natures'),
      Meteor.subscribe('signals'),
      Meteor.subscribe('hub', this.params._id)
    ]
  },
  data: function(){
    return Hubs.findOne({
      _id: this.params._id
    });
  }
});

Router.route("/signals", {
  name: "signals",
  waitOn: function() {
    return [
      Meteor.subscribe('themes'),
      Meteor.subscribe('mechanisms'),
      Meteor.subscribe('purposes')
    ];
  }
});

Router.route('/signal/:_id', {
  name: 'signal',
  template: 'signalDetail',
  waitOn: function(){
    return [
      Meteor.subscribe('signal', this.params._id),
      Meteor.subscribe('hubs'),
      Meteor.subscribe('origins'),
      Meteor.subscribe('incidencyReachs'),
      Meteor.subscribe('purposes'),
      Meteor.subscribe('themes'),
      Meteor.subscribe('methods'),
      Meteor.subscribe('mechanisms'),
      Meteor.subscribe('incidencyTypes')
    ];
  },
  data: function(){
    return Signals.findOne({
      _id: this.params._id
    });
  }
});


/*
 * Explore route
 */

Router.route("/explore", {
  loadingTemplate: 'loading',
  waitOn: function() {
    return [
      Meteor.subscribe('themes'),
      Meteor.subscribe('signals'),
      Meteor.subscribe('hubs'),
      Meteor.subscribe('natures'),
      Meteor.subscribe('incidencyReachs'),
      Meteor.subscribe('incidencyTypes'),
      Meteor.subscribe('technologyTypes'),
      Meteor.subscribe('origins'),
      Meteor.subscribe('mechanisms'),
      Meteor.subscribe('methods'),
      Meteor.subscribe('purposes')
    ];
  },
  name: "explore"
});

/*
 * List route
 */

Router.route("/list", {
  waitOn: function() {
    return [
      Meteor.subscribe('themes'),
      Meteor.subscribe('natures'),
      Meteor.subscribe('incidencyReachs'),
      Meteor.subscribe('incidencyTypes'),
      Meteor.subscribe('origins'),
      Meteor.subscribe('mechanisms'),
      Meteor.subscribe('methods'),
      Meteor.subscribe('purposes'),
      Meteor.subscribe('signals'),
      Meteor.subscribe('hubs'),
    ];
  },
  name: "list"
});

/*
 * Auth config
 */

Router.plugin('ensureSignedIn', {
  except: ['home', 'admin', 'about', 'mapping', 'hubs', 'hub', 'signals', 'signal', 'explore', 'list']
});

AccountsTemplates.configure({
  defaultLayout: 'authLayout',
  onLogoutHook: function() {
    Router.go('/admin');
  }
});

AccountsTemplates.configureRoute('signIn', {
  path: '/admin',
  redirect: '/admin/hubs'
});
