Template.appMenu.events({
  "click #menu_close": function(event, template){
    $('#menu').animate({left: (-1 * $('#menu').width() )}, 350, '');
  },
  "mouseleave #menu": function(event, template){
    $('#menu').animate({left: (-1 * $('#menu').width() )}, 350, '');
  },
  "click .bt": function(event, template){
    if (this.route)
      Router.go(this.route);
  },
  "mouseover .bt": function(event, template){
    var message;
    switch (event.currentTarget.id) {
      case "email":
        message = "Email (comunicacao@updatepolitics.cc)";
        break;
      case "medium":
        message = "Medium (https://medium.com/update-politics)";
        break;
      case "twitter":
        message = "Twitter (https://twitter.com/update_politics)";
        break;
      case "github":
        message = "Github (https://github.com/updatepolitics";
        break;
    }

    $("#contact_name").html(message);
  },
  "mouseout .bt": function(event, template){
    $("#contact_name").html("");
  },
  "click .sub_bt": function(event, template){
    $(window).scrollTop();
    Router.go(this.route, {}, {hash: this.anchor});
  },
  "click #email": function(event) {
    window.open('mailto:comunicacao@updatepolitics.cc');
  },
  "click #medium": function(event) {
    window.open('https://medium.com/update-politics', '_blank');
  },
  "click #twitter": function(event) {
    window.open('https://twitter.com/update_politics', '_blank');
  },
  "click #github": function(event) {
    window.open('https://github.com/updatepolitics', '_blank');
  }
});

Template.appMenu.helpers({
  menuItemLabel: function(route) {
    return 'menu.items.' + this.route;
  },
  subMenuItemLabel: function(route) {
    return 'menu.sub_items.' + this.route + '.' + this.anchor;
  },
  isSelected: function() {
    if (Router.current().route.getName(this) == self.route) {
      return 'selected'
    }
  },
  menuItens: function(){
    return [{
      route: 'home'
    }, {
      route: 'map'
    }, {
      route: 'list'
    }, {
      route: 'mapping',
      anchors: [
        "about",
        "methodology",
        "coverage",
        "team",
        "digital-platform",
        "partners"
      ]
    }, {
      route: 'tendencies'
    }, {
      route: 'hubs',
      anchors: [
          'intro',
          'natures'
      ]
    }, {
      route: 'signals',
      anchors: [
        "intro",
        "tech",
        "themes",
        "mechanisms",
        "purpose"
      ]
    }, {
      route: 'register'
    }, {
      route: 'subscribe'
    }, {
      route: 'download'
    }, {
      route: 'about',
      anchors: [
        "intro",
        "context",
        "who",
        "financer",
        "transparency",
        "partners"
      ]
    }];
  },
  anchors: function() {
    // Will pass route parameter along with anchor
    var self = this;
    if (Router.current().route.getName(this) == self.route) {
      return _.map(this.anchors, function(anchor){
        return {
          route: self.route,
          anchor: anchor
        };
      });
    }
  }
});
