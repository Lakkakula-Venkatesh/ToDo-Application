const User = require("../models/user");

const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const randomstring = require("randomstring");

const SALT_ROUNDS = 10;
const TOKEN_SECRET = "dirvnbpbcahqlbdwxhnzkkwagsrcscir";

const login = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (!user) {
    res.status(400).send({ message: "User not found with given parameters" });
    return;
  }

  const validPassword = bcrypt.compareSync(password, user.password);

  if (validPassword) {
    user.currentSignInAt = new Date();

    user.save();

    const payload = {
      id: user.id,
      email: user.email
    };

    res.status(200).send({
      message: "User login success",
      token: generateWebToken(payload)
    });
  } else {
    res.status(400).send({
      message: "Invalid Credentials"
    });
  }
};

const register = async (req, res) => {
  const { name, email, password, mobile } = req.body;

  const existingUser = await User.findOne({ email: email });

  if (existingUser !== null) {
    res.status(200).send({
      message: "User already exists with the given mail"
    });
    return;
  }

  const firstName = name.split(" ")[0].trim();
  const lastName = name.slice(firstName.length, name.length).trim();

  const encryptedPassword = getEncryptedPassword(password);

  const newUser = new User({
    email: email,
    firstName: firstName,
    lastName: lastName,
    password: encryptedPassword,
    mobile: mobile,
    currentSignInAt: new Date(),
    oldPasswords: [encryptedPassword]
  });

  const savedUser = await newUser.save();

  res.status(400).send({
    message: "User registration success",
    token: generateWebToken({ id: newUser.id, email: newUser.email })
  });
};

const update = async (req, res) => {
  const { name, email, password, mobile } = req.body;

  const user = await User.findOne({ email: email });

  if (name !== undefined) {
    user.firstName = name.split(" ")[0].trim();
    user.lastName = name.slice(firstName.length, name.length).trim();
  }

  if (password !== undefined) {
    let oldPhrases = [...user.oldPasswords, user.password];
    user.oldPasswords = oldPhrases;
    user.password = getEncryptedPassword(password);
  }

  user.mobile = mobile;

  user.save();

  res.status(200).send({ message: "Updated User Succesfully" });
};

const logout = async (req, res) => {
  const { id, email } = decryptToken(req.body.token);

  const loggedOutUser = await User.findOneAndUpdate(
    { email: email },
    { lastSignInAt: new Date() },
    { new: true }
  );

  res.status(200).send({ message: "User logged out succesfully" });
};

const generateResetToken = async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email: email });

  if (user === undefined) {
    res.status(400).send({ message: "User does not exist with given mail" });
    return;
  }

  const oldPhrases = [...user.oldPasswords, user.password];

  if (
    oldPhrases.findIndex(phrase => bcrypt.compareSync(password, phrase)) === -1
  ) {
    res
      .status(400)
      .send({ message: "Sorry! Unable to recognise you as a genuine user" });
    return;
  }

  user.resetPasswordToken = randomstring.generate();

  user.save();

  res.status(200).send({
    message: "Use this link to reset your password",
    link: generateWebToken({
      email: user.email,
      resetPasswordToken: user.resetPasswordToken
    })
  });
};

const reset = async (req, res) => {
  const { email, resetPasswordToken, iat, eat } = decryptToken(req.body.token);

  const user = await User.findOne({ email: email });

  if (user.resetPasswordToken !== resetPasswordToken) {
    res.status(400).send({ message: "Rest Password Token Expired" });
    return;
  }

  const encryptedPassword = getEncryptedPassword(req.body.password);
  let oldPhrases = [...user.oldPasswords, user.password];

  user.oldPasswords = oldPhrases;
  user.password = encryptedPassword;
  user.resetPasswordToken = "";

  user.save();

  res.status(200).send({ message: "Succesfully Updated Password" });
};

const generateWebToken = data =>
  jwt.sign(data, TOKEN_SECRET, { expiresIn: "24h" });

const getEncryptedPassword = password => {
  const salt = bcrypt.genSaltSync(Number(SALT_ROUNDS));
  const encryptedPassword = bcrypt.hashSync(password, salt);

  return encryptedPassword;
};

const decryptToken = token => jwt.verify(token, TOKEN_SECRET);

module.exports = { login, register, update, logout, generateResetToken, reset };
