const Card = require('../models/card');
const BadRequest = require('../errors/BadRequest');
const NotFoundError = require('../errors/NotFoundError');
const ErrorForbidden = require('../errors/ErrorForbidden');

const getCards = async (req, res, next) => {
  try {
    const cards = await Card.find({}).populate(['owner', 'likes']);
    return res.status(200).json(cards);
  } catch (e) {
    return next(e);
  }
};

const deleteCard = async (req, res, next) => {
  try {
    const { cardId } = req.params;
    const card = await Card.findById(cardId);
    if (card == null) {
      throw new NotFoundError('Карточка не найдена');
    }
    if (String(card.owner) === req.user._id) {
      await card.remove();
      return res.status(200).json({ message: 'карточка удалена' });
    }
    throw new ErrorForbidden('нет прав для удаления карточки');
  } catch (e) {
    if (e.name === 'CastError') {
      return next(new BadRequest('передан некорректный запрос'));
    }
    return next(e);
  }
};

const createCard = async (req, res, next) => {
  try {
    const { name, link } = req.body;
    const card = await Card.create({ name, link, owner: req.user._id });
    const result = await Card.findById(card._id).populate('owner');
    return res.status(201).json(result);
  } catch (e) {
    if (e.name === 'ValidationError') {
      return next(new BadRequest('переданы некорректные данные в методы создания карточки'));
    }
    return next(e);
  }
};

const addLike = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $addToSet: { likes: req.user._id } },
      { new: true },
    ).populate(['owner', 'likes']);
    if (card === null) {
      throw new NotFoundError('Такой карточки не существует');
    }
    return res.status(201).json(card); // [{ likes: card.likes }]
  } catch (e) {
    if (e.name === 'CastError') {
      return next(new BadRequest('передан некорректный запрос'));
    }
    return next(e);
  }
};

const deleteLike = async (req, res, next) => {
  try {
    const card = await Card.findByIdAndUpdate(
      req.params.cardId,
      { $pull: { likes: req.user._id } },
      { new: true },
    ).populate(['owner', 'likes']);
    if (card == null) {
      throw new NotFoundError('Такой карточки не существует');
    }
    return res.status(200).json(card);
  } catch (e) {
    if (e.name === 'CastError') {
      return next(new BadRequest('передан некорректный запрос'));
    }
    return next(e);
  }
};

module.exports = {
  getCards, createCard, deleteCard, addLike, deleteLike,
};
