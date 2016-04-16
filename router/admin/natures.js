/*
 * Natures admin routes
 */

Router.route("admin/natures/create", {
  layoutTemplate: 'adminLayout',
  name: 'nature.create',
  template: 'natureForm'
});

Router.route("admin/natures", {
  layoutTemplate: 'adminLayout',
  name: 'nature.list'
});

Router.route('admin/natures/:_id/edit', {
  layoutTemplate: 'adminLayout',
  name: 'nature.edit',
  template: 'natureForm',
  waitOn: function(){
    return Meteor.subscribe('nature', this.params._id);
  },
  data: function(){
    return Natures.findOne({
      _id: this.params._id
    });
  }
});
