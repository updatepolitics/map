Meteor.publish('users', function () {
  return Meteor.users.find({}, {limit: 20});
});

Meteor.publish('hubs', function () {
  return Hubs.find({}, {sort: {name:1}});
});

Meteor.publish('hub', function (_id) {
  check(_id, String);
  return Hubs.find({
    _id: _id
  });
});

Meteor.publish('origins', function () {
  return Origins.find({});
});

Meteor.publish('natures', function () {
  return Natures.find({});
});
