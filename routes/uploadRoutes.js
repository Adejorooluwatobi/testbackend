const express = require('express');
const router = express.Router();
const { upload } = require('../config/cloudinary');

/**
 * @swagger
 * /api/upload:
 *   post:
 *     summary: Upload a file to Cloudinary
 *     tags: [Upload]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: Uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 url:
 *                   type: string
 */
router.post('/', upload.single('file'), (req, res) => {
  try {
    if (!req.file) {
      console.warn('Upload attempt with no file');
      return res.status(400).json({ message: 'No file uploaded' });
    }
    console.log('File uploaded to Cloudinary successfully:', req.file.path);
    res.json({ url: req.file.path });
  } catch (err) {
    console.error('Cloudinary Upload Error:', err);
    res.status(500).json({ 
      message: 'Cloudinary Upload Failed', 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

/**
 * @swagger
 * /api/upload/multiple:
 *   post:
 *     summary: Upload multiple files to Cloudinary
 *     tags: [Upload]
 *     requestBody:
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               files:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       200:
 *         description: Uploaded successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 urls:
 *                   type: array
 *                   items:
 *                     type: string
 */
router.post('/multiple', upload.array('files', 10), (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      console.warn('Upload attempt with no files');
      return res.status(400).json({ message: 'No files uploaded' });
    }
    const urls = req.files.map(file => file.path);
    console.log('Files uploaded to Cloudinary successfully:', urls.length);
    res.json({ urls });
  } catch (err) {
    console.error('Cloudinary Multiple Upload Error:', err);
    res.status(500).json({ 
      message: 'Cloudinary Multiple Upload Failed', 
      error: err.message,
      stack: process.env.NODE_ENV === 'development' ? err.stack : undefined
    });
  }
});

module.exports = router;
