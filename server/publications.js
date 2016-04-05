Meteor.publish('users', function () {
  return Meteor.users.find({}, {limit: 20});
});

/*
 * Hubs
 */

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

/*
 * Natures
 */

Meteor.publish('natures', function () {
  return Natures.find({},{});
});

Meteor.publish('nature', function (_id) {
  check(_id, String);
  return Natures.find({
    _id: _id
  });
});

/*
 * Themes
 */

Meteor.publish('themes', function () {
  return Themes.find({},{});
});

Meteor.publish('theme', function (_id) {
  check(_id, String);
  return Themes.find({
    _id: _id
  });
});

/*
 * Mechanisms
 */

Meteor.publish('mechanisms', function () {
  return Mechanisms.find({},{});
});

Meteor.publish('mechanism', function (_id) {
  check(_id, String);
  return Mechanisms.find({
    _id: _id
  });
});
