/*
 * Default layout
 */

Router.configure({
  layoutTemplate: "appLayout",
  trackPageView: true
});

/*
 * Home route
 */

Router.route("/", { name: "home" });

/*
 * Static pages routes
 */

Router.route("/about", { name: "about" });
Router.route("/subscribe", { name: "subscribe" });
Router.route("/mapping", { name: "mapping" });
Router.route("/tendencies", { name: "tendencies" });
Router.route("/countries", { name: "countries" });
Router.route("/register", { name: "register" });
Router.route("/download", { name: "download" });

/*
 * Hubs routes
 */

Router.route("/hubs", {
  name: "hubs",
  waitOn: function() {
    return [Meteor.subscribe("natures")];
  }
});

Router.route("/hub/:_id", {
  name: "hub",
  template: "hubDetail",
  waitOn: function() {
    return [
      Meteor.subscribe("origins"),
      Meteor.subscribe("purposes"),
      Meteor.subscribe("incidencyTypes"),
      Meteor.subscribe("incidencyReachs"),
      Meteor.subscribe("natures"),
      Meteor.subscribe("signals"),
      Meteor.subscribe("hub", this.params._id)
    ];
  },
  data: function() {
    return Hubs.findOne({
      _id: this.params._id
    });
  }
});

Router.route("/signals", {
  name: "signals",
  waitOn: function() {
    return [
      Meteor.subscribe("themes"),
      Meteor.subscribe("mechanisms"),
      Meteor.subscribe("purposes")
    ];
  }
});

Router.route("/signal/:_id", {
  name: "signal",
  template: "signalDetail",
  waitOn: function() {
    return [
      Meteor.subscribe("signal", this.params._id),
      Meteor.subscribe("hubs"),
      Meteor.subscribe("origins"),
      Meteor.subscribe("incidencyReachs"),
      Meteor.subscribe("purposes"),
      Meteor.subscribe("themes"),
      Meteor.subscribe("methods"),
      Meteor.subscribe("mechanisms"),
      Meteor.subscribe("incidencyTypes")
    ];
  },
  data: function() {
    return Signals.findOne({
      _id: this.params._id
    });
  }
});

/*
 * Explore route
 */

Router.route("/explore/map", {
  loadingTemplate: "loading",
  waitOn: function() {
    return [
      Meteor.subscribe("themes"),
      Meteor.subscribe("signals"),
      Meteor.subscribe("hubs"),
      Meteor.subscribe("natures"),
      Meteor.subscribe("incidencyReachs"),
      Meteor.subscribe("incidencyTypes"),
      Meteor.subscribe("technologyTypes"),
      Meteor.subscribe("origins"),
      Meteor.subscribe("mechanisms"),
      Meteor.subscribe("methods"),
      Meteor.subscribe("purposes")
    ];
  },
  name: "map"
});

/*
 * List route
 */

Router.route("/explore/list", {
  waitOn: function() {
    return [
      Meteor.subscribe("methods"),
      Meteor.subscribe("signals"),
      Meteor.subscribe("hubs")
    ];
  },
  name: "list"
});

/*
 * Auth config
 */

Router.plugin("ensureSignedIn", {
  except: [
    "home",
    "admin",
    "about",
    "register",
    "tendencies",
    "download",
    "subscribe",
    "mapping",
    "hubs",
    "hub",
    "signals",
    "signal",
    "map",
    "list"
  ]
});

/*
* Auth layout
*/

AccountsTemplates.configure({
  defaultLayout: "authLayout",
  forbidClientAccountCreation: true,
  onLogoutHook: function() {
    Router.go("/admin");
  }
});

AccountsTemplates.configureRoute("signIn", {
  path: "/admin",
  redirect: "/admin/hubs"
});

/*
* Download data
*/

Router.route(
  "/download/update.zip",
  function() {
    var self = this;

    Meteor.call("updateDataZip", function(err, csvFiles) {
      if (err) return console.log(err);

      // Create zip
      var zip = new JSZip();

      // Add a file to the zip
      _.each(csvFiles, function(file) {
        zip.file(file.filename, file.content);
      });

      // Generate zip stream
      var output = zip.generate({
        type: "nodebuffer",
        compression: "DEFLATE"
      });

      // Set headers
      self.response.setHeader("Content-Type", "application/octet-stream");
      self.response.setHeader(
        "Content-disposition",
        "attachment; filename=update.zip"
      );
      self.response.writeHead(200);

      // Send content
      self.response.end(output);
    });
  },
  { where: "server" }
);

Router.route(
  "/download/hubs.csv",
  function() {
    var self = this;

    Meteor.call("hubsCsv", function(err, csv) {
      if (err) return console.log(err);

      // Set headers
      self.response.setHeader("Content-Type", "text/plain;charset=utf-8");
      self.response.setHeader(
        "Content-disposition",
        "attachment; filename=hubs.csv"
      );
      self.response.writeHead(200);

      // Send content
      self.response.end(csv);
    });
  },
  { where: "server" }
);

Router.route(
  "/download/signals.csv",
  function() {
    var self = this;

    Meteor.call("signalsCsv", function(err, csv) {
      if (err) return console.log(err);

      // Set headers
      self.response.setHeader("Content-Type", "text/plain;charset=utf-8");
      self.response.setHeader(
        "Content-disposition",
        "attachment; filename=signals.csv"
      );
      self.response.writeHead(200);

      // Send content
      self.response.end(csv);
    });
  },
  { where: "server" }
);
