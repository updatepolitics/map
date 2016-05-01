Template.list.onCreated(function() {
  if (!Session.get('currentContext'))
    Session.set('currentContext', 'signals');
});

Template.list.onRendered(function(){
  var bar_h = 80;

  $('body').addClass('light_bg');
  Template.instance().$('#list').css({ marginTop:bar_h+40, marginBottom:bar_h});
});

Template.list.helpers({
  listItems: function(){
    var context = Session.get('currentContext');
    var items;

    if (context == 'signals') items = Signals.find({});
    else items = Hubs.find({});

    Session.set('itemsCount', items.count());

    return items;
  }
});
