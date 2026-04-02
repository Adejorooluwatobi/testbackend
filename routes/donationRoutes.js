const express = require('express');
const router = express.Router();
const Donation = require('../entities/Donation');
const DonationTransaction = require('../entities/DonationTransaction');
const DonationDTO = require('../dtos/DonationDTO');
const DonationTransactionDTO = require('../dtos/DonationTransactionDTO');
const Notification = require('../entities/Notification');
const { protect, admin, optionalProtect } = require('../middleware/authMiddleware');

/**
 * @swagger
 * components:
 *   schemas:
 *     DonationPage:
 *       type: object
 *       properties:
 *         banner: { type: object }
 *         choose:
 *           type: object
 *           properties:
 *             suggestedAmounts: { type: array, items: { type: number } }
 *             programs: { type: array, items: { type: string } }
 *         addition:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               header: { type: string }
 *               description: { type: string }
 *         card:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               header: { type: string }
 *               annualGoal: { type: number }
 *               amountRaised: { type: number }
 *               progress: { type: number }
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     figure: { type: string }
 *                     label: { type: string }
 *         details: { type: array }
 *     DonationTransaction:
 *       type: object
 *       required: [firstname, lastname, email, amount]
 *       properties:
 *         firstname: { type: string }
 *         lastname: { type: string }
 *         email: { type: string }
 *         amount: { type: number }
 *         program: { type: string }
 *         message: { type: string }
 *         status: { type: string, enum: [pending, success, failed] }
 *         isRead: { type: boolean, default: false }
 */

/**
 * @swagger
 * tags:
 *   name: Donation
 *   description: Donation page content and user donation records
 */

// --- PAGE CONTENT ---

/**
 * @swagger
 * /api/donation:
 *   get:
 *     summary: Get donation page content (public)
 *     tags: [Donation]
 *     responses:
 *       200:
 *         description: Donation page content
 */
router.get('/', async (req, res) => {
  try {
    const donation = await Donation.findOne();
    res.json(DonationDTO.format(donation));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/donation/page:
 *   post:
 *     summary: Update donation page configuration (Admin only)
 *     tags: [Donation]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DonationPage'
 *     responses:
 *       200:
 *         description: Updated successfully
 */
router.post('/page', protect, admin, async (req, res) => {
  try {
    const donation = await Donation.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true
    });
    res.status(200).json(DonationDTO.format(donation));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// --- TRANSACTIONS ---

/**
 * @swagger
 * /api/donation:
 *   post:
 *     summary: Submit a new donation (User)
 *     tags: [Donation]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/DonationTransaction'
 *     responses:
 *       201:
 *         description: Donation recorded successfully
 *         security:
 *           - bearerAuth: []
 */
router.post('/', optionalProtect, async (req, res) => {
  try {
    if (req.user) {
      req.body.user = req.user._id;
    }
    const transaction = await DonationTransaction.create(req.body);

    // Create Notification for Admin
    await Notification.create({
      type: 'donation',
      message: `New donation of ${transaction.amount} from ${transaction.firstname} ${transaction.lastname}`,
      referenceId: transaction._id
    });

    res.status(201).json(DonationTransactionDTO.format(transaction));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/donation/records:
 *   get:
 *     summary: List all donation records (Admin only, Latest first)
 *     tags: [Donation]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of transactions
 */
router.get('/records', protect, admin, async (req, res) => {
  try {
    const records = await DonationTransaction.find().sort({ createdAt: -1 });
    res.json(DonationTransactionDTO.format(records));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/donation/records/{id}:
 *   get:
 *     summary: View a donation record by ID (Admin only, Marks as read)
 *     tags: [Donation]
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
 *         description: Record details
 *       404:
 *         description: Record not found
 */
router.get('/records/:id', protect, admin, async (req, res) => {
  try {
    const record = await DonationTransaction.findByIdAndUpdate(
      req.params.id,
      { isRead: true },
      { new: true }
    );
    if (!record) return res.status(404).json({ message: 'Record not found' });
    res.json(DonationTransactionDTO.format(record));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
