const express = require('express');
const router = express.Router();
const Contact = require('../entities/Contact');
const ContactDTO = require('../dtos/ContactDTO');

/**
 * @swagger
 * components:
 *   schemas:
 *     Contact:
 *       type: object
 *       properties:
 *         header:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         contactInformation:
 *           type: object
 *           properties:
 *             ourOffice:
 *               type: array
 *               items: { type: string }
 *             phoneNumbers:
 *               type: array
 *               items: { type: string }
 *             emailAddress:
 *               type: array
 *               items: { type: string }
 */

/**
 * @swagger
 * tags:
 *   name: Contact
 *   description: Contact page management
 */

/**
 * @swagger
 * /api/contact:
 *   get:
 *     summary: Returns the contact information
 *     tags: [Contact]
 *     responses:
 *       200:
 *         description: Contact info
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 */
router.get('/', async (req, res) => {
  try {
    const contact = await Contact.findOne();
    res.json(ContactDTO.format(contact));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/contact:
 *   post:
 *     summary: Create or update contact information (Upsert)
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       200:
 *         description: Updated/Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 */
router.post('/', async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true
    });
    res.status(200).json(ContactDTO.format(contact));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/contact:
 *   patch:
 *     summary: Partially update contact information
 *     tags: [Contact]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Contact'
 *     responses:
 *       200:
 *         description: Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Contact'
 */
router.patch('/', async (req, res) => {
  try {
    const contact = await Contact.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true
    });
    res.json(ContactDTO.format(contact));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
