Template.appMenu.events({
  "click #menu_close": function(event, template){
    $('#menu').animate({left: (-1 * $('#menu').width() )}, 350, 'swing');
  },
  "mouseleave #menu": function(event, template){
    $('#menu').animate({left: (-1 * $('#menu').width() )}, 350, 'swing');
  },
  "click .bt": function(event, template){
    Router.go(this.route);
  },
  "click .sub_bt": function(event, template){
    Router.go(this.route, {}, {hash: this.anchor});
  },
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
      route: 'explore'
    }, {
      route: 'mapping',
      anchors: [
        "about",
        "methodology"
      ]
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
