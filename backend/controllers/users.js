const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const Unauthorized = require('../errors/Unauthorized');
const ConflictError = require('../errors/ConflictError');

const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email }).select('+password');
    if (user === null) {
      throw new Unauthorized('Неправильный пароль или логин');
    }
    const result = await bcrypt.compare(password, user.password);
    if (!result) {
      throw new Unauthorized('Неправильный пароль или логин');
    }
    const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });
    return res.status(200).json({ token });
  } catch (e) {
    return next(e);
  }
};

const getUsers = async (req, res, next) => {
  try {
    const users = await User.find({});
    return res.status(200).json(users);
  } catch (e) {
    return next(e);
  }
};

const getUser = async (req, res, next) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId);
    if (user === null) {
      throw new NotFoundError('Пользователь не найден');
    }
    return res.status(200).json(user);
  } catch (e) {
    if (e.name === 'CastError') {
      return next(new BadRequest('передан некорректный запрос'));
    }
    return next(e);
  }
};

const getUserMe = async (req, res, next) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);
    if (user === null) {
      throw new NotFoundError('Пользователь не найден');
    }
    return res.status(200).json(user);
  } catch (e) {
    return next(e);
  }
};

const createUser = async (req, res, next) => {
  try {
    const {
      name, about, avatar, email, password,
    } = req.body;
    const hash = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      about,
      avatar,
      email,
      password: hash,
    });
    const token = jwt.sign({ _id: user._id }, 'some-secret-key', { expiresIn: '7d' });

    return res.status(201).json({
      name,
      about,
      avatar,
      email,
      _id: user._id,
      token,
    });
  } catch (e) {
    if (e.code === 11000) {
      return next(new ConflictError('Пользоватиель с таким email уже существует'));
    }
    if (e.name === 'ValidationError') {
      return next(new BadRequest('переданы некорректные данные в методы создания пользователя'));
    }
    return next(e);
  }
};

const updateUser = async (req, res, next) => {
  try {
    const { body } = req;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      body,
      { new: true, runValidators: true },
    );
    if (user === null) {
      throw new NotFoundError('Пользователь не найден');
    }

    return res.status(200).json(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return next(new BadRequest('переданы некорректные данные в методы создания пользователя'));
    }
    return next(e);
  }
};

const updateUserAvatar = async (req, res, next) => {
  try {
    const { avatar } = req.body;
    const user = await User.findByIdAndUpdate(
      req.user._id,
      { avatar },
      { new: true, runValidators: true },
    );
    if (user === null) {
      throw new NotFoundError('Пользователь не найден');
    }
    return res.status(200).json(user);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return next(new BadRequest('Переданы некорректные данные при обновлении аватара'));
    }

    return next(e);
  }
};

module.exports = {
  getUsers, getUser, createUser, updateUser, updateUserAvatar, login, getUserMe,
};
