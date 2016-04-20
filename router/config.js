Router.configure({
  layoutTemplate: 'appLayout'
});

Router.route("/", {name: "home"});
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
