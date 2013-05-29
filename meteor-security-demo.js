// Declares a 'secrets' Collection both client and server side.
Secrets = new Meteor.Collection('secrets');

// All of our client-side functionality.
if (Meteor.isClient) {

  Template.secretAdder.events({
    'click #secretButton': function(event) {
     var text = $('#secretText').val();
     Secrets.insert({secret: text, userId: Meteor.userId()});
    }
  });

  // Returns the logged in user, or null if non-existent.
  Template.securityApplication.loggedIn = function() {
    return Meteor.user();
  };

  // Returns all the secrets for the currently logged in user.
  Template.secrets.secrets = function() {
    return Secrets.find({userId: Meteor.userId()});
  };

  Template.secrets.events({
    // Removes the secret associated with the clicked delete button.
    'click .removeSecretBtn': function(event) {
      var id = event.srcElement.dataset.secret;
      Secrets.remove(id);
    },
    'click .publishSecretBtn': function(event) {
      var id = event.srcElement.dataset.secret;
      Secrets.update(id, {$set:{"public":true}});
    }
  });

  // Returns all the secrets marked as public.
  Template.publicSecrets.secrets = function() {
    return Secrets.find({public: true});
  };

  Template.publicSecrets.events({
    'click .privateSecretBtn': function() {
    var id = event.srcElement.dataset.secret;
    Secrets.update(id, {$set:{"public":false}}, function (error) {
      if (error) {
        alert("You can't make someone else's secrets private!");
      }
    });
    }
  });

  // Subscribes us to the 'yourSecrets' subscription.
  Meteor.subscribe('yourSecrets');

  // Subscribes us to the 'publicSecrets' subscription.
  Meteor.subscribe('publicSecrets');
}

// All of our server-side functionality.
if (Meteor.isServer) {

  // Only allow insertion or removal if the userId is not null
  // and is the same id as in the document.
  Secrets.allow({
    insert: function (userId, doc) {
      return (userId && userId == doc.userId) ? true : false;
    },
    remove: function (userId, doc) {
      return (userId && userId == doc.userId) ? true : false;
    },
    update: function (userId, doc, fieldNames, modifier) {
      return (userId && userId == doc.userId && fieldNames[0] == 'public') ? true : false;
    }
  });

  // Publish all of the secrets for the logged-in user as 'yourSecrets'.
  Meteor.publish('yourSecrets', function() {
    return Secrets.find({userId: this.userId});
  });

  // Publish all secrets that have been made public as 'publicSecrets'.
  Meteor.publish('publicSecrets', function() {
    return Secrets.find({public: true});
  });
}
