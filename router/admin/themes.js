/*
 * Themes admin routes
 */

Router.route("admin/themes/create", {
  layoutTemplate: 'adminLayout',
  name: 'theme.create',
  template: 'themeForm'
});

Router.route("admin/themes", {
  layoutTemplate: 'adminLayout',
  name: 'theme.list'
});

Router.route('admin/themes/:_id/edit', {
  layoutTemplate: 'adminLayout',
  name: 'theme.edit',
  template: 'themeForm',
  waitOn: function(){
    return Meteor.subscribe('theme', this.params._id);
  },
  data: function(){
    return Themes.findOne({
      _id: this.params._id
    });
  }
});
