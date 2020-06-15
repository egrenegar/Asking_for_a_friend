// Requiring our models and passport as we've configured it
var db = require('../models');
var passport = require('../config/passport');

module.exports = function(app) {
  // Using the passport.authenticate middleware with our local strategy.
  // If the user has valid login credentials, send them to the members page.
  // Otherwise the user will be sent an error
  app.post('/api/login', passport.authenticate('local'), function(req, res) {
    res.json(req.user);
  });

  // Route for signing up a user. The user's password is automatically hashed and stored securely thanks to
  // how we configured our Sequelize User Model. If the user is created successfully, proceed to log the user in,
  // otherwise send back an error
  app.post('/api/signup', function(req, res) {
    db.User.create({
      username: req.body.username, //change this to username
      password: req.body.password
    })
      .then(function() {
        res.redirect(307, '/api/login');
      })
      .catch(function(err) {
        res.status(401).json(err);
      });
  });

  // Post route for user questions
  app.post('/api/questions', function(req,res) {
    db.QandA.create({
      question: req.body.question,
      answer: req.body.answer
    })
      .then(function() {
        Location.reload();
      });
  });

  // Route for logging user out
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });

  // Route for getting some data about our user to be used client side
  app.get('/api/user_data', function(req, res) {
    if (!req.user) {
      // The user is not logged in, send back an empty object
      res.json({});
    } else {
      // Otherwise send back the user's username and id
      // Sending back a password, even a hashed password, isn't a good idea
      res.json({
        username: req.user.username, //change this to username
        id: req.user.id
      });
    }
  });

  // Route for getting all questions
  app.get('/api/all', function(req, res) {
    QandA.findAll({}).then(function(results) {
      res.json(results);
    });
  });

  // Route to update answers
  app.put('/api/questions', function(req, res) {
    // Update takes in an object describing the properties we want to update, and
    // we use where to describe which objects we want to update
    db.QandA.update({
      answer: req.body.complete
    }, {
      where: {
        id: req.body.id
      }
    }).then(function(result) {
      res.json(result);
    });
  });
};