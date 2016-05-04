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

/*
 * Methods
 */

Meteor.publish('methods', function () {
  return Methods.find({},{});
});

Meteor.publish('method', function (_id) {
  check(_id, String);
  return Methods.find({
    _id: _id
  });
});

/*
 * Signals
 */

Meteor.publish('signals', function () {
  return Signals.find({},{});
});

Meteor.publish('signal', function (_id) {
  check(_id, String);
  return Signals.find({
    _id: _id
  });
});

/*
 * IncidencyReachs
 */

Meteor.publish('incidencyReachs', function () {
  return IncidencyReachs.find({},{});
});

Meteor.publish('incidencyReach', function (_id) {
  check(_id, String);
  return IncidencyReachs.find({
    _id: _id
  });
});

/*
 * IncidencyTypes
 */

Meteor.publish('incidencyTypes', function () {
  return IncidencyTypes.find({},{});
});

Meteor.publish('technologyTypes', function () {
  return TechnologyTypes.find({},{});
});

Meteor.publish('incidencyType', function (_id) {
  check(_id, String);
  return IncidencyTypes.find({
    _id: _id
  });
});

/*
 * Purposes
 */

Meteor.publish('purposes', function () {
  return Purposes.find({},{});
});

Meteor.publish('purpose', function (_id) {
  check(_id, String);
  return Purposes.find({
    _id: _id
  });
});
