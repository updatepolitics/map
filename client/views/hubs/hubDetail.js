Template.hubDetail.onCreated(function (){
  $('body').addClass('light_bg')
});

Template.hubDetail.onDestroyed(function (){
  $('body').removeClass('light_bg')
});

Template.hubDetail.helpers({
  relatedSignals: function(){
    var hubId = this._id;
    var signals = Signals.find({parentHubs: {$in: [hubId]}});
    console.log('signals');
    console.log(signals);
    return signals;
  }
});

Template.hubDetail.events({
  "click .list": function(event, template){
    window.open(this.website, '_blank');
  }
});
