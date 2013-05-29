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
    return Secrets.find();
  };

  Template.secrets.events({
    // Removes the secret associated with the clicked delete button.
    'click input': function(event) {
      var id = event.toElement.id;
      Secrets.remove(id);
    }
  });

  // Subscribes us to the 'yourSecrets' subscription.
  Meteor.subscribe('yourSecrets');
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
    }
  });

  // Publish all of the secrets for the logged-in user as 'yourSecrets'.
  Meteor.publish('yourSecrets', function() {
    return Secrets.find({userId: this.userId});
  });
}
