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
      route: 'about',
      anchors: [
        'a_intro',
        'a_context',
        'a_who',
        'a_financer',
        'a_transparency',
        'a_partners'
      ]
    }, {
      route: 'mapping',
      anchors: [
        'about',
        'methodology',
        'coverage',
        'staff',
        'developers',
        'partners'
      ]
    }, {
      route: 'hubs',
      anchors: [
          'a_intro',
          'a_kind',
          'a_sponsor'
      ]
    }, {
      route: 'signals',
      anchors: [
        "intro",
        "tech",
        "theme",
        "purpose",
        "mechanism"
      ]
    }, {
      route: 'download'
    }, {
      route: 'explore'
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
