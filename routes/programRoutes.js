const express = require('express');
const router = express.Router();
const Program = require('../entities/Program');
const ProgramDTO = require('../dtos/ProgramDTO');

/**
 * @swagger
 * components:
 *   schemas:
 *     Program:
 *       type: object
 *       properties:
 *         banner:
 *           type: object
 *           properties:
 *             header: { type: string }
 *             title: { type: string }
 *             description: { type: string }
 *         card:
 *           type: array
 */

/**
 * @swagger
 * tags:
 *   name: Program
 *   description: Program management
 */

/**
 * @swagger
 * /api/program:
 *   get:
 *     summary: Returns the program page content
 *     tags: [Program]
 *     responses:
 *       200:
 *         description: Program content
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Program'
 */
router.get('/', async (req, res) => {
  try {
    const programs = await Program.findOne();
    res.json(ProgramDTO.format(programs));
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/program:
 *   post:
 *     summary: Create or update the program page (Upsert)
 *     tags: [Program]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Program'
 *     responses:
 *       200:
 *         description: Updated/Created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/Program'
 */
router.post('/', async (req, res) => {
  try {
    const program = await Program.findOneAndUpdate({}, req.body, {
      new: true,
      upsert: true,
      runValidators: true,
      setDefaultsOnInsert: true
    });
    res.status(200).json(ProgramDTO.format(program));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

/**
 * @swagger
 * /api/program/{id}:
 *   put:
 *     summary: Update a program by ID
 *     tags: [Program]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Program'
 *     responses:
 *       200:
 *         description: Updated successfully
 *   patch:
 *     summary: Partially update a program by ID
 *     tags: [Program]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/Program'
 *     responses:
 *       200:
 *         description: Updated successfully
 *   delete:
 *     summary: Delete a program by ID
 *     tags: [Program]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Deleted successfully
 */
router.put('/:id', async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!program) return res.status(404).json({ message: 'Program not found' });
    res.json(ProgramDTO.format(program));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.patch('/:id', async (req, res) => {
  try {
    const program = await Program.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
      runValidators: true
    });
    if (!program) return res.status(404).json({ message: 'Program not found' });
    res.json(ProgramDTO.format(program));
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

router.delete('/:id', async (req, res) => {
  try {
    const program = await Program.findByIdAndDelete(req.params.id);
    if (!program) return res.status(404).json({ message: 'Program not found' });
    res.json({ message: 'Program deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
