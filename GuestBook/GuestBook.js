Messages = new Mongo.Collection("messages");


if (Meteor.isClient) {
  Meteor.subscribe("messages");
  Template.GuestBook.helpers({
    "messages": function() {
      return Messages.find(
        {},
        {sort: {createdOn: -1}}) || {};
      //return all message objects, or an empty object if DB is invalid
    }
  });
  Template.GuestBook.events(
    {
      "submit form": function (event) {
        event.preventDefault();

        var messageBox = $(event.target).find('textarea[name=GuestBookMessage]');
        var messageText = messageBox.val();
        var nameBox = $(event.target).find('input[name=GuestName]');
        var nameText = nameBox.val();

        if(nameText.length > 0 &&
            messageText.length > 0) {
              Messages.insert(
              {
                name: nameText,
                message: messageText,
                createdOn: Date.now()
              });
              nameBox.val("");
              messageBox.val("");
        }
        else {
          //alert (name and message are both required.)
          console.log(messageBox);
          messageBox.classList.add("has-warning");
        }
        //alert("Name is " + nameText + ", msg is " + messageText);
      }
    }
  );
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.publish("messages", function() {
        return Messages.find();
      });
  });
}
