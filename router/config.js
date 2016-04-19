Router.configure({
  layoutTemplate: 'appLayout'
});

Router.route("/", {name: "home"});
Router.route("/about", {name: "about"});
Router.route("/mapping", {name: "mapping"});
Router.route("/countries", {name: "countries"});
Router.route("/hubs", {name: "hubs"});
Router.route("/signals", {name: "signals"});
