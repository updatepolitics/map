Session.set("resize", null);

Meteor.startup(function () {
  window.addEventListener('resize', function(){
    Session.set("resize", new Date());
  });
});

Template.registerHelper("formType", function(){
  if(_.isEmpty(this)) {
    return 'insert'
  } else {
    return 'update';
  }
});

Template.registerHelper("originsOptions", function(){
  return Origins.find({}, {sort: {en: 1}}).map(function (c) {
    return {label: c.en, value: c._id};
  });
});

Template.registerHelper("hubsOptions", function(){
  var result = [];
  Hubs.find({}, {sort: {name: 1}, fields: {name: 1}}).forEach(function (h) {
    result.push({label: h.name, value: h._id});
  });
  return result;
});

Template.registerHelper("natureOptions", function(){
  return Natures.find({}, { sort: {en: 1} }).map(function (n) {
    return {label: n.en, value: n._id};
  });
});

Template.registerHelper("incidencyReachOptions", function(){
  return IncidencyReachs.find({}).map(function (i) {
    return {label: i.en, value: i._id};
  });
});

Template.registerHelper("incidencyTypeOptions", function(){
  return IncidencyTypes.find({}).map(function (i) {
    return {label: i.en, value: i._id};
  });
});

Template.registerHelper("purposeOptions", function(){
  return Purposes.find({}, {sort: {en: 1}}).map(function (i) {
    return {label: i.en, value: i._id};
  });
});

Template.registerHelper("themesOptions", function(){
  return Themes.find({}, {sort: {en: 1}}).map(function (i) {
    return {label: i.en, value: i._id};
  });
});

Template.registerHelper("methodOptions", function(){
  return Methods.find({}, {sort: {en: 1}}).map(function (h) {
    return {label: h.en, value: h._id};
  });
});

Template.registerHelper("technologyTypeOptions", function(){
  return _.map(['Digital', 'Social'], function (i) {
    return {label: i, value: i};
  });
});

Template.registerHelper("mechanismOptions", function(argument){
  return Mechanisms.find({}, {sort: {en: 1}}).map(function (c) {
    return {label: c.en, value: c._id};
  });
});


/*
 * MAP & LIST helpers
 */

Template.registerHelper("isSignalContext", function(argument){

  // get context from session
  var context = Session.get('currentContext');

  // check if context is signals, return true if context is not defined
  return (!context || context == 'signals');
});

Template.registerHelper("itemsCount", function(argument){
  return Session.get('itemsCount');
});

/*
* FILTER helpers
*/

Template.registerHelper("filterCount", function(argument){
  var filterCount = JSON.parse(Session.get('filterCount'));
  var context = Session.get("currentContext");
  return filterCount[context];
});

Template.registerHelper("filterGroups", function(){
  var context = Session.get("currentContext");
  var filters = JSON.parse(Session.get('filters'));

  // get filter for current context
  var currentFilters = _.extend( filters['general'], filters[context]);

  return _.keys(currentFilters);
});

/*
* Initiatives popups & details
*/

Template.registerHelper("showPopup", function(argument){
  return Session.get('showPopup');
});

Template.registerHelper("getDescription", function(argument){
  var language = TAPi18n.getLanguage();
  return this["description_"+language];
});

Template.registerHelper("getNature", function(){
  var language = TAPi18n.getLanguage();
  var nature = Natures.findOne({_id: this.nature });
  return {
    title: nature[language],
    description: nature['description_'+language]
  };
});

Template.registerHelper("originsToString", function(){
  var language = TAPi18n.getLanguage();
  var ids = this.placesOfOrigin || [];

  var origins = Origins
    .find({ _id: { $in: ids }})
    .map(function(item){
      return item[language]
    });

  if (origins.length > 0) return origins.join(', ')
  else return '';
});

Template.registerHelper("reachToString", function(){
  var language = TAPi18n.getLanguage();
  var reach = IncidencyReachs.findOne(this.incidencyReach);
  return reach[language];
});

Template.registerHelper("natureToString", function(){
  var language = TAPi18n.getLanguage();
  var reach = IncidencyReachs.findOne(this.incidencyReach);
  return reach[language];
});

Template.registerHelper("purposeToString", function(){
  var language = TAPi18n.getLanguage();
  var purpose = Purposes.findOne(this.purpose);
  return purpose[language];
});


/*
 * Labels from denormalization
 */

Template.registerHelper("originsLabel", function(){
  var language = TAPi18n.getLanguage();
  return this.labels[language].placesOfOrigin;
});

Template.registerHelper("purposeLabel", function(){
  var language = TAPi18n.getLanguage();
  return this.labels[language].purpose;
});

Template.registerHelper("incidencyReachLabel", function(){
  var language = TAPi18n.getLanguage();
  return this.labels[language].incidencyReach;
});

Template.registerHelper("incidencyTypeLabel", function(){
  var language = TAPi18n.getLanguage();
  return this.labels[language].incidencyType;
});

Template.registerHelper("technologyTypeLabel", function(){
  var language = TAPi18n.getLanguage();
  return this.labels[language].technologyType;
});

 Template.registerHelper("translatedProperty", function(property){
   var language = TAPi18n.getLanguage();

   if (property == 'name') return this[language];
 });
