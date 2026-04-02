const express = require('express');
const router = express.Router();
const About = require('../entities/About');
const AboutDTO = require('../dtos/AboutDTO');

/**
 * @swagger
 * components:
 *   schemas:
 *     About:
 *       type: object
 *       properties:
 *         banner:
 *           type: object
 *           properties:
 *             header: { type: string }
 *             title: { type: string }
 *             description: { type: string }
 *         ourMission:
 *           type: object
 *           properties:
 *             header: { type: string }
 *             title: { type: string }
 *             description: { type: string }
 *             cards: { type: array }
 *         ourVision:
 *           type: object
 *           properties:
 *             icon: { type: string }
 *             title: { type: string }
 *             description: { type: string }
 *             progress: { type: number }
 *         team:
 *           type: object
 *           properties:
 *             header: { type: string }
 *             title: { type: string }
 *             card: { type: array }
 *         ourJourney:
 *           type: array
 */

/**
 * @swagger
 * tags:
 *   name: About
 *   description: About page management
 */

/**
 * @swagger
 * /api/about:
 *   get:
 *     summary: Returns about page content
 *     tags: [About]
 *     responses:
 *       200:
 *         description: The about page content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/About'
 */
router.get('/', async (req, res) => {
  try {
    const data = await About.findOne();
    res.json(AboutDTO.format(data));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/about:
 *   post:
 *     summary: Create or update the about page entry (Upsert)
 *     tags: [About]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/About'
 *     responses:
 *       200:
 *         description: Updated/Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/About'
 */
router.post('/', async (req, res) => {
  try {
    const data = await About.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true
    });
    res.status(200).json(AboutDTO.format(data));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/about:
 *   patch:
 *     summary: Partially update the about page entry
 *     tags: [About]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/About'
 *     responses:
 *       200:
 *         description: Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/About'
 */
router.patch('/', async (req, res) => {
  try {
    const data = await About.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true
    });
    res.json(AboutDTO.format(data));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
