SECRET COLLECTOR
================

Basically this showcases some of the security techniques around Meteor.js. You can fork the repository
to play around with it or try setting up up your own project.

Not Obvious Setup
-----------------

Out of the box, Meteor includes a few packages that are...insecure. You'll need to remove these:
```
meteor remove autopublish
meteor remove insecure
```
Additionally I chose to take advantage of Meteor's built-in password based authentication and appropriate UI:
```
meteor add accounts-password
meteor add accounts-ui
```
