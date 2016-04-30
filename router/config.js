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
Router.route("/hubs", {
  name: "hubs",
  waitOn: function() {
    return [
      Meteor.subscribe('natures')
    ];
  },
  data: function() {
    return {
      natures: Natures.find({}, {
        sort: { en: 1 }
      })
    }
  }
});
Router.route("/signals", {name: "signals"});

/*
 * Explore route
 */

Router.route("/explore", {
  waitOn: function() {
    return [
      Meteor.subscribe('themes'),
      Meteor.subscribe('signals'),
      Meteor.subscribe('hubs'),
      Meteor.subscribe('natures'),
      Meteor.subscribe('incidencyReachs'),
      Meteor.subscribe('incidencyTypes'),
      Meteor.subscribe('origins'),
      Meteor.subscribe('mechanisms'),
      Meteor.subscribe('methods'),
      Meteor.subscribe('purposes')
    ];
  },
  name: "explore"
});

/*
 * Auth config
 */

Router.plugin('ensureSignedIn', {
  except: ['home', 'admin', 'about', 'mapping', 'hubs', 'signals', 'explore']
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
