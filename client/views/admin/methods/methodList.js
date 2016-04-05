Template.methodList.onCreated(function (){
  this.subscribe('methods');
});


Template.methodList.helpers({
  methods: function() {
    return Methods.find({},{sort: {en: 1}});
  },
});
