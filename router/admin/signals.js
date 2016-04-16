/*
 * Signals admin routes
 */

Router.route("admin/signals/create", {
  layoutTemplate: 'adminLayout',
  name: 'signal.create',
  template: 'signalForm'
});

Router.route("admin/signals", {
  layoutTemplate: 'adminLayout',
  name: 'signal.list'
});

Router.route('admin/signals/:_id/edit', {
  layoutTemplate: 'adminLayout',
  name: 'signal.edit',
  template: 'signalForm',
  waitOn: function(){
    return Meteor.subscribe('signal', this.params._id);
  },
  data: function(){
    return Signals.findOne({
      _id: this.params._id
    });
  }
});
