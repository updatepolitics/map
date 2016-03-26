Meteor.publish('hubs', function () {
  return Hubs.find({}, {limit: 10});
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
