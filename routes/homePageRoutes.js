const express = require('express');
const router = express.Router();
const HomePage = require('../entities/HomePage');
const HomePageDTO = require('../dtos/HomePageDTO');

/**
 * @swagger
 * components:
 *   schemas:
 *     HomePage:
 *       type: object
 *       properties:
 *         banner:
 *           type: object
 *           properties:
 *             header: { type: string }
 *             title: { type: string }
 *             description: { type: string }
 *             buttons: { type: array }
 *             imageUrl: { type: string }
 *             bannerSummary: { type: array }
 *         whatWeDo:
 *           type: object
 *           properties:
 *             header: { type: string }
 *             title: { type: string }
 *             description: { type: string }
 *             items: { type: array }
 *         testimonials:
 *           type: object
 *           properties:
 *             header: { type: string }
 *             title: { type: string }
 *             description: { type: string }
 *             items: { type: array }
 *         quote:
 *           type: object
 *           properties:
 *             header: { type: string }
 *             text: { type: string }
 *             author: { type: string }
 *             cards: { type: array }
 *         donate:
 *           type: object
 *           properties:
 *             header: { type: string }
 *             title: { type: string }
 *             description: { type: string }
 *             buttons: { type: array }
 *         partners:
 *           type: array
 */

/**
 * @swagger
 * tags:
 *   name: HomePage
 *   description: Home page content management
 */

/**
 * @swagger
 * /api/homepage:
 *   get:
 *     summary: Returns the home page content
 *     tags: [HomePage]
 *     responses:
 *       200:
 *         description: Home page content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HomePage'
 */
router.get('/', async (req, res) => {
  try {
    const homePage = await HomePage.findOne();
    res.json(HomePageDTO.format(homePage));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/homepage:
 *   post:
 *     summary: Create or update the home page entry (Upsert)
 *     tags: [HomePage]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HomePage'
 *     responses:
 *       200:
 *         description: Updated/Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HomePage'
 */
router.post('/', async (req, res) => {
  try {
    const homePage = await HomePage.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true
    });
    res.status(200).json(HomePageDTO.format(homePage));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/homepage:
 *   patch:
 *     summary: Partially update the home page entry
 *     tags: [HomePage]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HomePage'
 *     responses:
 *       200:
 *         description: Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/HomePage'
 */
router.patch('/', async (req, res) => {
  try {
    const homePage = await HomePage.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true
    });
    res.json(HomePageDTO.format(homePage));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
