/*
 * Mechanism admin routes
 */

Router.route("admin/mechanisms/create", {
  layoutTemplate: 'adminLayout',
  name: 'mechanism.create',
  template: 'mechanismForm'
});

Router.route("admin/mechanisms", {
  layoutTemplate: 'adminLayout',
  name: 'mechanism.list',
  waitOn: function() {
    return [
      Meteor.subscribe('mechanisms', { fields: {name: 1} } )
    ];
  },
  data: function() {
    return {
      mechanisms: Mechanisms.find({}, {
        sort: { name: 1 },
        fields: { name: 1 }
      })
    }
  }
});

Router.route('admin/mechanisms/:_id/edit', {
  layoutTemplate: 'adminLayout',
  name: 'mechanism.edit',
  template: 'mechanismForm',
  waitOn: function(){
    return Meteor.subscribe('mechanism', this.params._id);
  },
  data: function(){
    return Mechanisms.findOne({
      _id: this.params._id
    });
  }
});
