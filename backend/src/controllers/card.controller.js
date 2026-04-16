const cardService = require('../services/card.service');
const asyncHandler = require('../utils/asyncHandler');

const getCards = asyncHandler(async (req, res) => {
  const cards = await cardService.getCards(req.user.id);

  res.json({
    cards,
  });
});

const createCard = asyncHandler(async (req, res) => {
  const card = await cardService.createCard(req.user.id, req.body);

  res.status(201).json({
    message: 'Card saved successfully.',
    card,
  });
});

const deleteCard = asyncHandler(async (req, res) => {
  await cardService.deleteCard(req.user.id, req.params.id);

  res.json({
    message: 'Card deleted successfully.',
  });
});

module.exports = {
  createCard,
  deleteCard,
  getCards,
};
