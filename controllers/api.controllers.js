require("mongoose"); // Ensure mongoose is in scope

const User = require("../models/user.model"); // User model
const Endpoint = require("../models/endpoint.model"); // Endpoint model

// Abstract away all api controller functions
// with a single object, APIControllers.
// This enables "dependency injection" wherever needed.
const APIControllers = {};

// Status: work-in-progress

/*
// Endpoint model
key   --> section
value --> all links for that section in object form

general: {
  endpoints: {
    method: "GET",
    url: "/api/endpoints",
    requires_login: false
  },
  go_home: {
    method: "GET",
    url: "/api",
    requires_login: false
  },
}

auth: {
  create_user: {
    method: "POST",
    url: "/api/auth/signup",
    requires_login: false
  },
  login: {
    method: "POST",
    url: "/api/auth/login",
    requires_login: false
  },
  logout: {
    method: "POST",
    url: "/api/auth/logout",
    requires_login: true
  },  
} // auth

notes: {
  create_note: {
    method: "POST",
    url: "/api/notes/:username",
    requires_login: true
  },
  all_notes: {
    method: "GET",
    url: "/api/notes",
    requires_login: false
  },
  user_notes: {
    method: "GET",
    url: "/api/notes/:username",
    requires_login: false
  },
  view_note: {
    method: "GET",
    url: "/api/notes/:username/:noteId",
    requires_login: false
  },
  edit_note: {
    method: "PATCH",
    url: "/api/notes/:username/:noteId/edit",
    requires_login: true
  },
  delete_note: {
    method: "DELETE",
    url: "/api/notes/:username/:noteId/del",
    requires_login: true
  },
} // notes

user: {
  all_users: {
    method: "GET",
    url: "/api/users",
    requires_login: false
  },
  view_user: {
    method: "GET",
    url: "/api/users/:username",
    requires_login: false
  },
  edit_user: {
    method: "PATCH",
    url: "/api/users/:username/edit",
    requires_login: true
  },
  delete_user: {
    method: "DELETE",
    url: "/api/users/:username/del",
    requires_login: true
  },
}

*/
