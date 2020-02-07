require('mongoose'); // Ensure mongoose is in scope

const User = require('../models/user.model'); // User model
const Endpoint = require('../models/endpoint.model'); // Endpoint model

// Abstract away all note controller functions 
// with a single object, APIControllers.
// This enables "dependency injection" wherever needed.
const APIControllers = {};

// Status: work-in-progress



/*
App endpoints:

// general
endpoints: `http://localhost:4001/api/endpoints`
go_home: 'http://localhost:4001',

// users
all_users: 'http://localhost:4001/api/users',
view_user: `http://localhost:4001/api/users/${user.username}`,

// notes
all_notes: `http://localhost:4001/api/notes`,
user_notes: `http://localhost:4001/api/notes/${user.username}`
view_note: `http://localhost:4001/api/notes/${note.username}/${note._id}`

// auth
sign_in: 'http://localhost:4001/api/auth/login',
sign_up: 'http://localhost:4001/api/auth/signup',

*/








