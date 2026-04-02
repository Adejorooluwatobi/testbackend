const express = require('express');
const router = express.Router();
const Consultation = require('../entities/Consultation');
const ConsultationDTO = require('../dtos/ConsultationDTO');
const Notification = require('../entities/Notification');
const { protect, admin } = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Consultation:
 *       type: object
 *       properties:
 *         firstname: { type: string }
 *         lastname: { type: string }
 *         email: { type: string }
 *         phonenumber: { type: string }
 *         subject: { type: string }
 *         message: { type: string }
 *         isRead: { type: boolean, default: false }
 */

/**
 * @swagger
 * tags:
 *   name: Consultation
 *   description: Consultation and contact management
 */

/**
 * @swagger
 * /api/consultation:
 *   post:
 *     summary: Submit a new consultation request
 *     tags: [Consultation]
 *     requestBody:
 *       required: false
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Consultation'
 *     responses:
 *       201:
 *         description: Submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Consultation'
 */
router.post('/', async (req, res) => {
  try {
    const consultation = await Consultation.create(req.body);
    
    // Create Notification for Admin
    await Notification.create({
      type: 'consultation',
      message: `New consultation request from ${consultation.firstname} ${consultation.lastname}`,
      referenceId: consultation._id
    });

    res.status(201).json(ConsultationDTO.format(consultation));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/consultation:
 *   get:
 *     summary: Get all consultation requests (Admin only, Latest first)
 *     tags: [Consultation]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of consultations
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/Consultation'
 */
router.get('/', protect, admin, async (req, res) => {
  try {
    const consultations = await Consultation.find().sort({ createdAt: -1 });
    res.json(ConsultationDTO.format(consultations));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/consultation/{id}:
 *   get:
 *     summary: Get a consultation by ID (Admin only, Marks as read)
 *     tags: [Consultation]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Consultation found and marked as read
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Consultation'
 *       404:
 *         description: Consultation not found
 */
router.get('/:id', protect, admin, async (req, res) => {
  try {
    const consultation = await Consultation.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!consultation) {
      return res.status(404).json({ message: 'Consultation not found' });
    }
    res.json(ConsultationDTO.format(consultation));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
