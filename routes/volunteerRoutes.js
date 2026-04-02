const express = require('express');
const router = express.Router();
const Volunteer = require('../entities/Volunteer');
const VolunteerAppForm = require('../entities/VolunteerAppForm');
const VolunteerDTO = require('../dtos/VolunteerDTO');
const VolunteerAppFormDTO = require('../dtos/VolunteerAppFormDTO');
const Notification = require('../entities/Notification');
const { protect, admin, optionalProtect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     Volunteer:
 *       type: object
 *       properties:
 *         banner:
 *           type: object
 *           properties:
 *             title: { type: string }
 *             description: { type: string }
 *         header:
 *           type: string
 *         title:
 *           type: string
 *         card:
 *           type: array
 *     VolunteerAppForm:
 *       type: object
 *       required:
 *         - firstname
 *         - lastname
 *         - email
 *         - phonenumber
 *       properties:
 *         firstname:
 *           type: string
 *         lastname:
 *           type: string
 *         email:
 *           type: string
 *         phonenumber:
 *           type: string
 *         stateOfResidence:
 *           type: string
 *         availability:
 *           type: string
 *         areaOfExpertise:
 *           type: string
 *         preferredProgram:
 *           type: string
 *         whatYouVolunteer:
 *           type: string
 *         isRead:
 *           type: boolean
 *           default: false
 */

/**
 * @swagger
 * tags:
 *   name: Volunteer
 *   description: Volunteer management and applications
 */

/**
 * @swagger
 * /api/volunteer:
 *   get:
 *     summary: Returns volunteer page information
 *     tags: [Volunteer]
 *     responses:
 *       200:
 *         description: Volunteer page content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Volunteer'
 *   post:
 *     summary: Create/Update volunteer page information (Upsert)
 *     tags: [Volunteer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Volunteer'
 *     responses:
 *       200:
 *         description: Updated/Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Volunteer'
 */

// Volunteer Page Info
router.get('/', async (req, res) => {
  try {
    const data = await Volunteer.findOne();
    res.json(VolunteerDTO.format(data));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.post('/', async (req, res) => {
  try {
    const data = await Volunteer.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true
    });
    res.status(200).json(VolunteerDTO.format(data));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/volunteer:
 *   patch:
 *     summary: Partially update volunteer page information
 *     tags: [Volunteer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Volunteer'
 *     responses:
 *       200:
 *         description: Updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Volunteer'
 */
router.patch('/', async (req, res) => {
  try {
    const data = await Volunteer.findOneAndUpdate({}, req.body, {
      new: true,
      runValidators: true
    });
    res.json(VolunteerDTO.format(data));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/volunteer/applications:
 *   get:
 *     summary: Returns all volunteer applications (Latest first)
 *     tags: [Volunteer]
 *     responses:
 *       200:
 *         description: List of applications
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/VolunteerAppForm'
 */

// Volunteer Applications List
router.get('/applications', async (req, res) => {
  try {
    const apps = await VolunteerAppForm.find().sort({ createdAt: -1 });
    res.json(VolunteerAppFormDTO.format(apps));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/volunteer/applications/{id}:
 *   get:
 *     summary: Get a volunteer application by ID (Marks as read)
 *     tags: [Volunteer]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Application found and marked as read
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VolunteerAppForm'
 *       404:
 *         description: Application not found
 */
router.get('/applications/:id', async (req, res) => {
  try {
    const app = await VolunteerAppForm.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!app) {
      return res.status(404).json({ message: 'Application not found' });
    }
    res.json(VolunteerAppFormDTO.format(app));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/volunteer/applications:
 *   post:
 *     summary: Submit a volunteer application
 *     tags: [Volunteer]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/VolunteerAppForm'
 *     responses:
 *       201:
 *         description: Submitted successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/VolunteerAppForm'
 *         security:
 *           - bearerAuth: []
 */
router.post('/applications', optionalProtect, async (req, res) => {
  try {
    if (req.user) {
      req.body.user = req.user._id;
    }
    const app = await VolunteerAppForm.create(req.body);

    // Create Notification for Admin
    await Notification.create({
      type: 'volunteer_app',
      message: `New volunteer application from ${app.firstname} ${app.lastname}`,
      referenceId: app._id
    });

    res.status(201).json(VolunteerAppFormDTO.format(app));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
