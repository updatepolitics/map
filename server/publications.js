Meteor.publish('users', function () {
  return Meteor.users.find({}, {limit: 20});
});

Meteor.publish('hubs', function () {
  return Hubs.find({}, {limit: 20});
});

Meteor.publish('hub', function (_id) {
  check(_id, String);
  return Hubs.find({
    _id: _id
  });
});

Meteor.publish('countries', function () {
  return Countries.find({});
});

Meteor.publish('natures', function () {
  return Natures.find({});
});
