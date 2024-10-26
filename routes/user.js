const jwt = require("jsonwebtoken");
const { User } = require("../db/index");

const users = [];
const JWT_SECRET = "TRELLOCLONE";

async function auth(req, res, next) {
  const token = req.headers.token;
  if (token) {
    jwt.verify(token, JWT_SECRET, (err, decoded) => {
      if (err) {
        res.status(401).send({ msg: "wrong token" });
      } else {
        req.user = decoded.username;
        next();
      }
    });
  } else {
    res.status(401).send({ msg: "no token provided" });
  }
}

async function signup(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ msg: "user already exists" });
    }
    const userDoc = await User.create({
      username: username,
      password: password,
    });
    const token = jwt.sign(
      {
        username: username,
      },
      JWT_SECRET
    );
    res.status(200).json({ token: token });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "error while signing up" });
  }
}

async function signin(req, res, next) {
  const username = req.body.username;
  const password = req.body.password;

  try {
    const foundUser = await User.findOne({ username, password });
    if (foundUser) {
      const token = jwt.sign(
        {
          username: username,
        },
        JWT_SECRET
      );
      res.status(200).json({ token: token });
    } else {
      res.status(400).json({ msg: "invalid credentials" });
    }
  } catch (err) {
    console.log(err);
    res.json(500).json({ msg: "error signing in" });
  }
}

async function me(req, res, next) {
  const username = req.user;

  try {
    const foundUser = await User.findOne({ username });
    if (foundUser) {
      res
        .status(200)
        .json({ username: foundUser.username, password: foundUser.password });
    } else {
      res.status(404).json({ msg: "user does not exist" });
    }
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "error retreiving user" });
  }
}

module.exports = {
  auth,
  signin,
  signup,
  me,
};
