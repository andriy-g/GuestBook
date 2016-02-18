Messages = new Mongo.Collection("messages");

Router.route('/messages/:_id', function() {
  this.render('message', {
    data: function () {
      return Messages.findOne({_id: this.params._id});
    }
  });
  this.layout('layout');
},
{
  name: 'message.show'
});

Router.route('/', function() {
  this.render('GuestBook');
  this.layout('layout');
});

Router.route('/about', function () {
    this.render('about'); //render about template
    this.layout('layout');    //set the main layout template
});




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
        // var nameBox = $(event.target).find('input[name=GuestName]');
        // var nameText = nameBox.val();
        var nameText = Meteor.user().username;

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
  Accounts.ui.config({
    //options are listed in book on p. 135
    //for email only change to EMAIL_ONLY, USERNAME_AND_EMAIL
    passwordSignupFields: "USERNAME_ONLY"
  });
}

if (Meteor.isServer) {
  Meteor.startup(function () {
    Meteor.publish("messages", function() {
        return Messages.find();
      });
  });

  Accounts.onCreateUser(function(options, user) {

    //when user gets created, it may have some options
    //that come along with it. For example, Facebook
    //accounts have extra properties that get stroes
    //in the options object

    //The user object is where we want to store profile
    //information for us to access in our meteor app.
      if(options.profile) {
        user.profile = options.profile;
      }
      else {
        user.profile = {};
      }
      return user;
  });
}
