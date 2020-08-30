"use strict";

function _slicedToArray(arr, i) { return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _nonIterableRest(); }

function _nonIterableRest() { throw new TypeError("Invalid attempt to destructure non-iterable instance"); }

function _iterableToArrayLimit(arr, i) { if (!(Symbol.iterator in Object(arr) || Object.prototype.toString.call(arr) === "[object Arguments]")) { return; } var _arr = []; var _n = true; var _d = false; var _e = undefined; try { for (var _i = arr[Symbol.iterator](), _s; !(_n = (_s = _i.next()).done); _n = true) { _arr.push(_s.value); if (i && _arr.length === i) break; } } catch (err) { _d = true; _e = err; } finally { try { if (!_n && _i["return"] != null) _i["return"](); } finally { if (_d) throw _e; } } return _arr; }

function _arrayWithHoles(arr) { if (Array.isArray(arr)) return arr; }

var User = require("../models/User");

var Post = require("../models/Post");

var Follow = require("../models/Follow");

var jwt = require("jsonwebtoken"); // how long a token lasts before expiring


var tokenLasts = "30s";

exports.apiGetPostsByUsername = function _callee(req, res) {
  var authorDoc, posts;
  return regeneratorRuntime.async(function _callee$(_context) {
    while (1) {
      switch (_context.prev = _context.next) {
        case 0:
          _context.prev = 0;
          _context.next = 3;
          return regeneratorRuntime.awrap(User.findByUsername(req.params.username));

        case 3:
          authorDoc = _context.sent;
          _context.next = 6;
          return regeneratorRuntime.awrap(Post.findByAuthorId(authorDoc._id));

        case 6:
          posts = _context.sent;
          //res.header("Cache-Control", "max-age=10").json(posts)
          res.json(posts);
          _context.next = 13;
          break;

        case 10:
          _context.prev = 10;
          _context.t0 = _context["catch"](0);
          res.status(500).send("Sorry, invalid user requested.");

        case 13:
        case "end":
          return _context.stop();
      }
    }
  }, null, null, [[0, 10]]);
};

exports.checkToken = function (req, res) {
  try {
    req.apiUser = jwt.verify(req.body.token, process.env.JWTSECRET);
    res.json(true);
  } catch (e) {
    res.json(false);
  }
};

exports.apiMustBeLoggedIn = function (req, res, next) {
  try {
    req.apiUser = jwt.verify(req.body.token, process.env.JWTSECRET);
    next();
  } catch (e) {
    res.status(500).send("Sorry, you must provide a valid token.");
  }
};

exports.doesUsernameExist = function (req, res) {
  User.findByUsername(req.body.username.toLowerCase()).then(function () {
    res.json(true);
  })["catch"](function (e) {
    res.json(false);
  });
};

exports.doesEmailExist = function _callee2(req, res) {
  var emailBool;
  return regeneratorRuntime.async(function _callee2$(_context2) {
    while (1) {
      switch (_context2.prev = _context2.next) {
        case 0:
          _context2.next = 2;
          return regeneratorRuntime.awrap(User.doesEmailExist(req.body.email));

        case 2:
          emailBool = _context2.sent;
          res.json(emailBool);

        case 4:
        case "end":
          return _context2.stop();
      }
    }
  });
};

exports.sharedProfileData = function _callee3(req, res, next) {
  var viewerId, postCountPromise, followerCountPromise, followingCountPromise, _ref, _ref2, postCount, followerCount, followingCount;

  return regeneratorRuntime.async(function _callee3$(_context3) {
    while (1) {
      switch (_context3.prev = _context3.next) {
        case 0:
          try {
            viewer = jwt.verify(req.body.token, process.env.JWTSECRET);
            viewerId = viewer._id;
          } catch (e) {
            viewerId = 0;
          }

          _context3.next = 3;
          return regeneratorRuntime.awrap(Follow.isVisitorFollowing(req.profileUser._id, viewerId));

        case 3:
          req.isFollowing = _context3.sent;
          postCountPromise = Post.countPostsByAuthor(req.profileUser._id);
          followerCountPromise = Follow.countFollowersById(req.profileUser._id);
          followingCountPromise = Follow.countFollowingById(req.profileUser._id);
          _context3.next = 9;
          return regeneratorRuntime.awrap(Promise.all([postCountPromise, followerCountPromise, followingCountPromise]));

        case 9:
          _ref = _context3.sent;
          _ref2 = _slicedToArray(_ref, 3);
          postCount = _ref2[0];
          followerCount = _ref2[1];
          followingCount = _ref2[2];
          req.postCount = postCount;
          req.followerCount = followerCount;
          req.followingCount = followingCount;
          next();

        case 18:
        case "end":
          return _context3.stop();
      }
    }
  });
};

exports.apiLogin = function (req, res) {
  var user = new User(req.body);
  user.login().then(function (result) {
    res.json({
      token: jwt.sign({
        _id: user.data._id,
        username: user.data.username,
        avatar: user.avatar
      }, process.env.JWTSECRET, {
        expiresIn: tokenLasts
      }),
      username: user.data.username,
      avatar: user.avatar
    });
  })["catch"](function (e) {
    res.json(false);
  });
};

exports.apiRegister = function (req, res) {
  var user = new User(req.body);
  user.register().then(function () {
    res.json({
      token: jwt.sign({
        _id: user.data._id,
        username: user.data.username,
        avatar: user.avatar
      }, process.env.JWTSECRET, {
        expiresIn: tokenLasts
      }),
      username: user.data.username,
      avatar: user.avatar
    });
  })["catch"](function (regErrors) {
    res.status(500).send(regErrors);
  });
};

exports.apiGetHomeFeed = function _callee4(req, res) {
  var posts;
  return regeneratorRuntime.async(function _callee4$(_context4) {
    while (1) {
      switch (_context4.prev = _context4.next) {
        case 0:
          _context4.prev = 0;
          _context4.next = 3;
          return regeneratorRuntime.awrap(Post.getFeed(req.apiUser._id));

        case 3:
          posts = _context4.sent;
          res.json(posts);
          _context4.next = 10;
          break;

        case 7:
          _context4.prev = 7;
          _context4.t0 = _context4["catch"](0);
          res.status(500).send("Error");

        case 10:
        case "end":
          return _context4.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.ifUserExists = function (req, res, next) {
  User.findByUsername(req.params.username).then(function (userDocument) {
    req.profileUser = userDocument;
    next();
  })["catch"](function (e) {
    res.json(false);
  });
};

exports.profileBasicData = function (req, res) {
  res.json({
    profileUsername: req.profileUser.username,
    profileAvatar: req.profileUser.avatar,
    isFollowing: req.isFollowing,
    counts: {
      postCount: req.postCount,
      followerCount: req.followerCount,
      followingCount: req.followingCount
    }
  });
};

exports.profileFollowers = function _callee5(req, res) {
  var followers;
  return regeneratorRuntime.async(function _callee5$(_context5) {
    while (1) {
      switch (_context5.prev = _context5.next) {
        case 0:
          _context5.prev = 0;
          _context5.next = 3;
          return regeneratorRuntime.awrap(Follow.getFollowersById(req.profileUser._id));

        case 3:
          followers = _context5.sent;
          //res.header("Cache-Control", "max-age=10").json(followers)
          res.json(followers);
          _context5.next = 10;
          break;

        case 7:
          _context5.prev = 7;
          _context5.t0 = _context5["catch"](0);
          res.status(500).send("Error");

        case 10:
        case "end":
          return _context5.stop();
      }
    }
  }, null, null, [[0, 7]]);
};

exports.profileFollowing = function _callee6(req, res) {
  var following;
  return regeneratorRuntime.async(function _callee6$(_context6) {
    while (1) {
      switch (_context6.prev = _context6.next) {
        case 0:
          _context6.prev = 0;
          _context6.next = 3;
          return regeneratorRuntime.awrap(Follow.getFollowingById(req.profileUser._id));

        case 3:
          following = _context6.sent;
          //res.header("Cache-Control", "max-age=10").json(following)
          res.json(following);
          _context6.next = 10;
          break;

        case 7:
          _context6.prev = 7;
          _context6.t0 = _context6["catch"](0);
          res.status(500).send("Error");

        case 10:
        case "end":
          return _context6.stop();
      }
    }
  }, null, null, [[0, 7]]);
};