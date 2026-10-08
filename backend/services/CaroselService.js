const fs = require('fs');
const path = require('path');
const CarouselModel = require('../models/CarouselModel');

const uploadsDir = path.join(__dirname, '../uploads');

const deleteOldFile = (filename) => {
  if (filename) {
    const filePath = path.join(uploadsDir, filename);
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath);
    }
  }
};

const sanitizeLink = (link) => {
  if (typeof link !== 'string') {
    return '';
  }

  const trimmed = link.trim();

  if (!trimmed) {
    return '';
  }

  const isRelative = trimmed.startsWith('/') && !trimmed.startsWith('//');
  const isAbsolute = /^https?:\/\//i.test(trimmed);

  if (!isRelative && !isAbsolute) {
    const error = new Error(
      'Link must be a relative path (e.g. /shop) or an http(s) URL'
    );
    error.statusCode = 400;
    throw error;
  }

  return trimmed.slice(0, 2048);
};

// Create Carousel

const createCarousel = async (imgSrc, link) => {
  return await CarouselModel.create({ imgSrc, link: sanitizeLink(link) });
};

// Update Carousel

const updateCarousel = async (id, link) => {
  return await CarouselModel.findByIdAndUpdate(
    id,
    { $set: { link: sanitizeLink(link) } },
    { new: true, runValidators: true }
  );
};

// Get All Carousel

const getAllCarousels = async () => {
  return await CarouselModel.find();
};

// Delete Carousel

const deleteCarousel = async (id) => {
  const carousel = await CarouselModel.findById(id);
  if (carousel && carousel.imgSrc) {
    deleteOldFile(carousel.imgSrc);
  }
  return await CarouselModel.findByIdAndDelete(id);
};

module.exports = {
  createCarousel,
  updateCarousel,
  getAllCarousels,
  deleteCarousel,
};
