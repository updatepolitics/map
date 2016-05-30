
Meteor.methods({
  'send': function(mailData) {

    var emailApiWrapper = new Mailgun(Meteor.settings.private.Mailgun);

    mailData['to'] = Meteor.settings.private.Mailgun.to;
    mailData['from'] = Meteor.settings.private.Mailgun.from;

    var res = emailApiWrapper.send(mailData);

    if (_.isObject(res.error)) {
        res.error = res.error.toString();
    }

    return res;
  }
});
