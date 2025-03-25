const express = require('express');
const { uploadImageController, deleteImageController } = require('../controllers/cloudinaryController');
const multer = require('multer');
const upload = multer({ dest: 'uploads/' });

const router = express.Router();

router.get('/', (req, res) => {
  res.send('Cloudinary Routes');
});
router.post('/upload', upload.single('image'), uploadImageController);
router.delete('/delete/:id', deleteImageController);

module.exports = router;
