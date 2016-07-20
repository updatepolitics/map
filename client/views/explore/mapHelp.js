Template.mapHelp.onCreated(function(){
  this.step = new ReactiveVar();
  this.step.set(1);
});

Template.mapHelp.helpers({
  step: function(){
    return Template.instance().step.get();
  },
  pageTitle: function(){
    var step = Template.instance().step.get();
    return TAPi18n.__('mapHelp.'+step+'.title');
  },
  pageText: function(){
    var step = Template.instance().step.get();
    return TAPi18n.__('mapHelp.'+step+'.text');
  }
});

Template.mapHelp.events({
  "click #help_x": function(event, template){
    Session.set('mapHelpIsOpen', !Session.get('mapHelpIsOpen') );
  },
  "click #help_next": function(event, template){
    var step = template.step.get();
    if (step != 4) {
      step++;
      template.step.set(step);
      positionFrame(step);
    }
  },
  "click #help_prev": function(event, template){
    var step = template.step.get();
    if (step != 1) {
      step--;
      template.step.set(step);
      positionFrame(step);
    }
  }
});

function positionFrame(step){
  var targets = [ control_hub, control_sig, control_filters, mode ];
  var target = $(targets[step-1]);

  // $(help_frame).css({
  $("#help_frame").css({
    width: target.width(),
    height: target.height(),
    left: target.offset().left,
		bottom: 0
  });

}

Template.mapHelp.onRendered(function(){
  positionFrame(this.step.get());
});
