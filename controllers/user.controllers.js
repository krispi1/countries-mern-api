require('mongoose'); // Ensure mongoose is in scope

const User = require('../models/user.model'); // User model

// Abstract away all user controller functions 
// with a single object, UserControllers.
// This enables "dependency injection" wherever needed.
const UserControllers = {};

// GET /api/users --> Fetch all users
UserControllers.fetchAllUsers = (req, res, next) => {
  console.log('\nfetchAllUsers invoked...');
  
  User
    .find()
    .select('_id username')
    .exec()
    .then(users => {
      const response = {
        count: users.length,
        users: users.map(user => {
          return {
            _id: user._id,
            username: user.username,
            notes: user.notes,
            view_user: `http://localhost:4001/api/users/${user.username}`,
            user_notes: `http://localhost:4001/api/notes/${user.username}`
          }
        })
      };
      return res.status(200).json({ 
        ...response, 
        all_notes: `http://localhost:4001/api/notes`,
        endpoints: `http://localhost:4001/api/endpoints`
      });
    }) // then
    .catch(err => {
      console.log(err);
      return res.status(500).json({ error: err });
    })
} // fetchAllUsers

// GET /api/users/:username --> Fetch a single user
UserControllers.fetchSingleUser = (req, res, next) => {
  console.log('\nfetchSingleUser invoked...');

  User
    .find({ username: req.params.username })
    .select('_id username')
    .exec()
    .then(user => {
      return (!user[0]) ? (
        // The username supplied is invalid or user not found
        res.status(500).json({
          message: 'Invalid user!!',
          go_home: 'http://localhost:4001',
          all_users: 'http://localhost:4001/api/users',
          all_notes: 'http://localhost:4001/api/notes',
          endpoints: `http://localhost:4001/api/endpoints`
        })
      ) : (
        // Successful user retrieval response
        res.status(200).json({ 
          user,
          more_links: {
            user_notes: `http://localhost:4001/api/notes/${user[0].username}`,
            all_notes: `http://localhost:4001/api/notes`,
            all_users: `http://localhost:4001/api/users`,
            endpoints: `http://localhost:4001/api/endpoints`
          }
        })
      )
    }) // then
    .catch(err => {
      console.log(err);
      return res.status(500).json({ error: err });
    })
} // fetchSingleUser

// PATCH /api/users/:username/edit --> Edit user --> Login required
UserControllers.editUser = (req, res, next) => {
  console.log('\neditUser invoked...');

  User
    .find({ username: req.body.username })
    .select('username email')
    .exec()
    .then(user => {
      // Prevent overwriting what we already have in the database
      // with a null value just in case no value is provided
      // for any given field (fields left blank upon submission)
      user.username = req.body.username ?
        req.body.username : user.username;

      user.email = req.body.email ?
        req.body.email : user.email;

      user
        .save()
        .then(updatedUser => {
          return res.json({
            message: 'User updated',
            updatedUser
          });
        })
        .catch(err => res.status(400).json({ error: err }))
    }) // then
    .catch(err => {
      console.log(err);
      return res.status(500).json({ error: err });
    })
} // editUser

// DELETE /api/users/:username/del --> Delete user --> Login required
UserControllers.deleteUser = (req, res, next) => {
  console.log('\ndeleteUser invoked...');

  User
    .deleteOne({ username: req.params.username })
    .exec()
    .then(result => {
      return res.status(200).json({
        message: 'User deleted!!',
        go_home: 'http://localhost:4001',
        all_users: 'http://localhost:4001/api/users',
        all_notes: 'http://localhost:4001/api/notes',
        endpoints: `http://localhost:4001/api/endpoints`
      })
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({
        error: err,
        go_home: 'http://localhost:4001', 
        all_users: 'http://localhost:4001/api/users',
        all_notes: 'http://localhost:4001/api/notes',
        endpoints: `http://localhost:4001/api/endpoints`
      })
    })
} // deleteUser

module.exports = UserControllers;


/* 

->GET     /api/users                 ---done && tested
->GET     /api/users/:username       ---done && tested
->PATCH   /api/users/:username/edit  ---done && tested
->DELETE  /api/users/:username/del   ---done && tested

// UserController routes & handler functions 

Method   Route                       Function           Purpose

GET      /api/users                  fetchAllUsers      Fetch all users 
GET      /api/users/:username        fetchSingleUser    Fetch a single user
PATCH    /api/users/:username/edit   editUser           Edit user
DELETE   /api/users/:username/del    deleteUser         Delete user


// console.log(UserControllers)
// {
//   fetchAllUsers: [Function],
//   fetchSingleUser: [Function],
//   editUser: [Function],
//   deleteUser: [Function]
// }

*/
