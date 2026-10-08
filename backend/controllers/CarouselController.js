const CarouselService = require('../services/CaroselService');

const createCarousel = async (req, res) => {
  try {
    if (!req.files || !req.files.imgSrc) {
      return res.status(400).json({ message: 'Image file is required' });
    }

    const fileName = req.files.imgSrc[0].filename; // Store only file name
    const carousel = await CarouselService.createCarousel(
      fileName,
      req.body.link
    );

    res.status(201).json(carousel);
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({ message: error.message });
    }
    res.status(500).json({ message: 'Server Error', error });
  }
};

const updateCarousel = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedCarousel = await CarouselService.updateCarousel(
      id,
      req.body.link
    );
    if (!updatedCarousel) {
      return res.status(404).json({ message: 'Carousel not found' });
    }
    return res.status(200).json(updatedCarousel);
  } catch (error) {
    if (error.statusCode === 400) {
      return res.status(400).json({ message: error.message });
    }
    return res.status(500).json({ message: error.message });
  }
};

const getAllCarousel = async (req, res) => {
  try {
    const carousels = await CarouselService.getAllCarousels();
    return res.status(200).json(carousels);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};
const deleteByIdCarousel = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedCarousel = await CarouselService.deleteCarousel(id);
    if (!deletedCarousel) {
      return res.status(404).json({ message: 'Carousel not found' });
    }
    return res.status(200).json({ message: 'Carousel deleted successfully' });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createCarousel,
  updateCarousel,
  getAllCarousel,
  deleteByIdCarousel,
};
