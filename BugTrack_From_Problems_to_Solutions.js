/*

////////////////////////////////////////////////////////////
BACKEND (/api) -- Express
I used Postman for making requests
I set /api/server.js to app.use(morgan('tiny')) for logging

////////////////////////////////////////////////////////////
Problem: api1

When: On attempt to create new user
Path: http://localhost:4001/auth/signup

Error:

{
    "error": {
        "errors": {
            "userName": {
                "message": "Path `userName` is required.",
                "name": "ValidatorError",
                "properties": {
                    "message": "Path `userName` is required.",
                    "type": "required",
                    "path": "userName"
                },
                "kind": "required",
                "path": "userName"
            }
        },
        "_message": "User validation failed",
        "message": "User validation failed: userName: Path `userName` is required.",
        "name": "ValidationError"
    }
}

Solution:

I realized it was a simple case of mismatching cases.
I had used "userName" in my mongoose model, but I supplied
"username" in my queries.

Lesson learned: mongoose.Schema is case-sensitive

////////////////////////////////////////////////////////////
Problem: api2

When: On attempt to create new user (successively)
Path: http://localhost:4001/auth/signup

Error:

at processTicksAndRejections (internal/process/task_queues.js:75:11) {
  driver: true,
  name: 'MongoError',
  index: 0,
  code: 11000,
  keyPattern: { userName: 1 },
  keyValue: { userName: null },
  errmsg: 'E11000 duplicate key error 
  collection: countriesMERN.users index:userName_1 
  dup key: { userName: null }',
  [Symbol(mongoErrorContextSymbol)]: {}
}

Solution:

Stemming from the api1 error above api2 comes about since
internally, mongodb had created an index for userName.

I fixed this problem by actually dropping the entire database 
in order for mongodb to start afresh with new keys and indexes.

// Some related reference:
https://stackoverflow.com/questions/24430220/e11000-duplicate-key-error-index-in-mongodb-mongoose

////////////////////////////////////////////////////////////
Problem api3

When: On attempt to log the user in
Path: http://localhost:4001/auth/login

Error:

_http_outgoing.js:485
    throw new ERR_HTTP_HEADERS_SENT('set');
    ^

Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the
client

Steps to solution:

To reproduce the error, I made a bunch of console.log statements in 
/controllers/auth.controllers.js file in AuthControllers.loginUser method.

//-------------------------------------------------------
Scenario 1:
I attempted login with a non-existent email and got the following logs:

--------logs--------
1. Request to /login initiated..
2. Inside then block: User not found..
POST /auth/login 401 108 - 4.291 ms

//-------------------------------------------------------
Scenario 2:
I attempted login with the wrong password and got the following logs:

--------logs--------
1. Request to /login initiated..
3. In bcrypt.compare block: Checking password..
8. In bcrypt.compare block: Default error block reached...
9. In bcrypt.compare (err) block: Password check failed..
POST /auth/login 401 108 - 168.219 ms

//-------------------------------------------------------
Scenario 3:
I attempted login with the correct password and got the following logs:

--------logs--------
1. Request to /login initiated..
3. In bcrypt.compare block: Checking password..
5. In bcrypt.compare (result) block: Password check passed..
6. In bcrypt.compare (result) block: Token generated..
7. In bcrypt.compare (result) block: Login successful..
8. In bcrypt.compare block: Default error block reached...
9. In bcrypt.compare (err) block: Password check failed..
_http_outgoing.js:485
    throw new ERR_HTTP_HEADERS_SENT('set');
    ^

Error [ERR_HTTP_HEADERS_SENT]: Cannot set headers after they are sent to the client

//-------------------------------------------------------
Findings: 

Scenario 1 and Scenario 2 turned out as expected.

Scenario 3 was erratic. All I was missing was just a return 
statement so the code was flowing through past log #7 even 
after setting and sending a bearer token to the user.

Solution:

I placed appropriate return statements in all proper places.

Scenario 3 -- Fixed.

--------logs--------
1. Request to /login initiated..
3. In bcrypt.compare block: Checking password..
5. In bcrypt.compare (result) block: Password check passed..
6. In bcrypt.compare (result) block: Token generated..
7. In bcrypt.compare (result) block: Login successful..
POST /auth/login 200 261 - 2215.476 ms


////////////////////////////////////////////////////////////
FRONTEND -- React

////////////////////////////////////////////////////////////
Problem f/end1

Error: Element type is invalid: expected a string (for built-in components) 
or a class/function (for composite components) but got: object.

Check the render method of `Context.Consumer`.


////////////////////////////////////////////////////////////
Problem f/end2

Warning: React does not recognize the `computedMatch` prop on a DOM element. 
If you intentionally want it to appear in the DOM as a custom attribute, 
spell it as lowercase `computedmatch` instead. If you accidentally passed 
it from a parent component, remove it from the DOM element.
    in div (at App.js:27)
    in Switch (at App.js:26)
    in Suspense (at App.js:25)
    in Router (created by BrowserRouter)
    in BrowserRouter (at App.js:24)
    in App (at src/index.js:11)
    in SetContext (at src/index.js:10)


////////////////////////////////////////////////////////////
Problem f/end3

When: On creating a failsafe for a wrong country name
Path: http://localhost:3000/countries/wrongcountry
File: src/components/Country.js

Error:

Country.js:32 Uncaught TypeError: Cannot convert undefined or null to object
    at Function.entries (<anonymous>)
    at Country (Country.js:32)
    at renderWithHooks (react-dom.development.js:16260)
    at updateFunctionComponent (react-dom.development.js:18347)
    at mountLazyComponent (react-dom.development.js:18657)
    at beginWork$1 (react-dom.development.js:20168)
    at HTMLUnknownElement.callCallback (react-dom.development.js:

Findings:
In my steps towards finding a solution, I realized that when
troubleshooting, it's really important to pay attention to
the error code. Uncaught TypeError in this case.

Testing for if (country === null || country === undefined) {}
couldn't catch the bug. Code execution still flowed through
the if statement's body and into the next block.

Solution:

This one was really frustrating. After carefully inspecting
the country object with these two lines:
// console.log(typeof country);
// console.log(Array.isArray(country));

-- I found that country was an array.

For that to work I had to access its first element country[0].

////////////////////////////////////////////////////////////
Problem f/end4

When: On attempt to establish connection to Mongodb Atlas
Path: http://localhost:3000/api/auth/users/
File: src/components/Country.js

DB connection error: MongooseTimeoutError: Server selection timed out after 30000 ms


*/
