var dur = 350;
var filter_h = 25;

Template.filterPanel.onCreated(function(){


});

Template.filterPanel.onRendered(function(){
  // trigger resize
  Session.set("resize", new Date());
});

Template.filterPanel.helpers({
  resize: function(){
    var height = $(window).height();

    $('#filters').height(height - 80 - 40);
  	$('#filters_list').height(height - 80 - 97);

    return Session.get('resize');
  },
  filterCount: function () {
    return 0;
  },
  generalFilterGroups: function() {
    return ['placesOfOrigin', 'incidencyReach'];
  },
  // filterGroups: function() {
  //   var context = Session.get('currentContext');
  //   var filters = JSON.parse(Session.get('filters'))[context];
  //   return _.keys(filters);
  // },
  // filterGroupSelectedCount: function() {
    // var context = Session.get('currentContext');
    // var filters = JSON.parse(Session.get('filters'))[context];
    //
    // var filterGroupName = this;
    //
    // var filterGroup = filters[filterGroupName];
    //
    // var count = 0
    // for (var i = 0; i < filterGroup.length; i++) {
    //   if (filterGroup[i].selected) count +=1;
    // }

  //   return 0;
  // },
  filterGroupOptions: function() {
    var filters = JSON.parse(Session.get('exploreConfig')).filters;

    var filterGroup = this;

    var result =  _.map(_.keys(filters[filterGroup]), function(i){
      var option = filters[filterGroup][i];
      option.filterGroup = filterGroup;
      return option;
    });

    return result;

  }


    // {{#each filterGroupOptions this }}
    //   {{#if selected}}
    //     <li class="filter selected" style="opacity: 1;">
    //       {{ pt }}
    //     </li>
    //   {{else}}
    //     <li class="filter" style="opacity: 0.2;">
    //       {{ en }} eita
    //     </li>
    //   {{/if}}
    // {{/each}}


    //
    // filters = _.map(_.keys(filters), function(filterGroup){
    //   return {
    //     label: filterGroup,
    //     options: filters[filterGroup],
    //     selectedCount: _.reduce(filters[filterGroup], function(count, item){
    //       if (item.selected) return count + 1;
    //       else return count;
    //     }, 0)
    //   }
    // });
    //
    //
    // // <ul class="group" style="height: 0;">
    // //     {{ selected }}
    // //       <li class="filter" style="opacity: 1;">
    // //         {{ en }}
    // //       </li>
    // //   </ul>
    // // {{/each}}
    //
    //
    // // filters = _.map(filters, function(filter){
    // //   return {
    // //     label: filter,
    // //     options: filters[filter]
    // //     // selectedCount: _.reduce(filters[filter], function(count, item){
    // //     //   if (item.selected) return count + 1;
    // //     // })
    // //   }
    // // });
    // console.log(filters);
    // return filters;
  // filterGroupOptions: function(filterGroup) {
  //   var context = Session.get('currentContext');
  //   var filters = Session.get('filters')[context];
  //
  //   return filters[filterGroup];
  // }
  // },
  // filterGroupLabel: function() {
  //   console.log();
  //   return 'eita'
  // },
  // filterGroupOptions: function(filterGroup) {
  //   var context = Session.get('currentContext');
  //   var filters = Session.get('filters')[context];
  //   console.log('filterGroup');
  //   console.log(filterGroup);
  //   console.log('filters');
  //   console.log(filters);
  //   console.log('filters[filterGroup]');
  //   console.log(filters[filterGroup]);
  //
  //
  //
  //   return filters[filterGroup];
  // }
});

Template.filterPanel.events({
  "click .filter_title": function(event, template){
    event.preventDefault();

    var target = $(event.currentTarget);

    var ul = target.next();
    var lis = ul.children();
    var height = 30 + lis.length * filter_h;
    if (ul.height() > 0) {
      ul.animate({height: 0 }, dur);
      target.css({ backgroundImage: 'url(layout/plus_white.png)'});
    } else {
      ul.animate({height: height }, dur);
      target.css({ backgroundImage: 'url(layout/minus_white.png)'});
    }
  },
  "click .filter": function(event, template) {
    event.preventDefault();
    var context = Session.get('currentContext');
    var exploreConfig = JSON.parse(Session.get('exploreConfig'));

    var self = this;

    var target = $(event.target);

    // get filter count for field
    var counterSpan = target.parent().prev().children('span');
    var selectedFiltersCount = parseInt(counterSpan.html());

    if (self.selected) {
      self.selected = false;
      selectedFiltersCount -= 1;
      target.removeClass('selected').css({opacity: 0.2 });
      if (selectedFiltersCount == 0) {
        target.parent().children().css({opacity: 1 });
      }
    } else {
      self.selected = true;
      selectedFiltersCount += 1;
      if (selectedFiltersCount == 1) {
        target.parent().children().css({opacity: 0.2 });
      }
      target.addClass('selected').css({opacity: 1 });
    }

    counterSpan.html(selectedFiltersCount);

    exploreConfig.filters[self.filterGroup][self._id].selected = self.selected;

    Session.set('exploreConfig', JSON.stringify(exploreConfig));
  }
});
