/*
 * Hubs admin routes
 */

Router.route("admin/hubs/create", {
  layoutTemplate: 'adminLayout',
  name: 'hub.create',
  template: 'hubForm'
});

Router.route("admin/hubs", {
  layoutTemplate: 'adminLayout',
  name: 'hub.list',
  waitOn: function() {
    return [
      Meteor.subscribe('hubs', { fields: {name: 1} } )
    ];
  },
  data: function() {
    return {
      hubs: Hubs.find({}, {
        sort: { name: 1 },
        fields: { name: 1 }
      })
    }
  }
});

Router.route('admin/hubs/:_id/edit', {
  layoutTemplate: 'adminLayout',
  name: 'hub.edit',
  template: 'hubForm',
  waitOn: function(){
    return Meteor.subscribe('hub', this.params._id);
  },
  data: function(){
    return Hubs.findOne({
      _id: this.params._id
    });
  }
});
