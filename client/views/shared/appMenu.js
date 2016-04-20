Template.appMenu.onRendered(function(){
  this.$(".ui.accordion").accordion();
});

Template.appMenu.events({
  "click #menu_close_button": function(event, template){
    $('#menu').animate({left: (-1 * $('#menu').width() )}, 350, 'swing');
  }
});

Template.appMenu.helpers({
  menuItens: function(){
    return [
      { "label": "HOME", "route": "home" },
      { "label": "UPDATE", "route": "about", "subItems" : [
        {"label": "About Update", "anchor": "a_intro" },
        {"label": "Context", "anchor": "a_context" },
        {"label": "Team", "anchor": "a_who" },
        {"label": "Sponsors", "anchor": "a_financer" },
        {"label": "Transparency", "anchor": "a_transparency" },
        {"label": "Partners", "anchor": "a_partners" }
      ]},
      { "label": "MAPPING", "_en": "MAPPING", "route": "mapping", "subItems" : [
         {"label": "About", "anchor": "a_about" },
         {"label": "Methodology", "anchor": "a_methodology" },
         {"label": "Scope", "anchor": "a_coverage" },
         {"label": "Mapping team", "anchor": "a_staff" },
         {"label": "Software", "anchor": "a_developers" },
         {"label": "Partners", "anchor": "a_partners" }
      ]},
      { "label": "HUBS", "route": "hubs", "subItems" : [
         {"label": "Introduction", "anchor": "intro" },
         {"label": "Nature", "anchor": "kind" },
         {"label": "Sponsor", "anchor": "financer" }
      ]},
      { "label": "SIGNALS", "route": "signals", "subItems" : [
         {"label": "Introduction", "anchor": "intro" },
         {"label": "Tecnology", "anchor": "tech" },
         {"label": "Themes", "anchor": "theme" },
         {"label": "Purpose", "anchor": "purpose" },
         {"label": "Methods", "anchor": "mechanism" }
      ]},
      { "label": "EXPLORE", "route": "EXPLORE"}
    ];
  }
});
