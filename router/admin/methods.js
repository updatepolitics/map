/*
 * Methods admin routes
 */

Router.route("admin/methods/create", {
  layoutTemplate: 'adminLayout',
  name: 'method.create',
  template: 'methodForm'
});

Router.route("admin/methods", {
  layoutTemplate: 'adminLayout',
  name: 'method.list'
});

Router.route('admin/methods/:_id/edit', {
  layoutTemplate: 'adminLayout',
  name: 'method.edit',
  template: 'methodForm',
  waitOn: function(){
    return [
      Meteor.subscribe('method', this.params._id),
      Meteor.subscribe('mechanisms')
    ];
  },
  data: function(){
    return Methods.findOne({
      _id: this.params._id
    });
  }
});
