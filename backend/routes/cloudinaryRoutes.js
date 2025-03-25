const express = require('express');
const { uploadImageController, deleteImageController } = require('../controllers/cloudinaryController');

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Cloudinary Routes');
});
router.post('/upload', uploadImageController);
router.delete('/delete/:id', deleteImageController);

module.exports = router;
