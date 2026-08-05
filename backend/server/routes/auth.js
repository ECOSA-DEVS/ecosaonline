const express = require('express')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const router = express.Router()
const Admin = require('../models/Admin')
const { addAdmin, findAdminByEmail, clone } = require('../utils/store')

const JWT_SECRET = process.env.JWT_SECRET || 'ecosa-dev-secret'

router.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body
    if (!email || !password) return res.status(400).json({ message: 'Email and password are required' })

    const existing = await Admin.findOne({ email }).catch(() => null)
    if (existing) return res.status(409).json({ message: 'Admin already exists' })

    const passwordHash = await bcrypt.hash(password, 10)
    const admin = new Admin({ name: name || 'Admin', email, passwordHash })
    try {
      await admin.save()
    } catch (err) {
      addAdmin({ name: name || 'Admin', email, passwordHash })
    }

    res.status(201).json({ ok: true, message: 'Admin created' })
  } catch (err) {
    res.status(500).json({ message: 'Failed to register admin' })
  }
})

router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    let admin = await Admin.findOne({ email }).catch(() => null)
    if (!admin) {
      admin = findAdminByEmail(email)
    }
    if (!admin) return res.status(401).json({ message: 'Invalid credentials' })

    const valid = await bcrypt.compare(password, admin.passwordHash)
    if (!valid) return res.status(401).json({ message: 'Invalid credentials' })

    const token = jwt.sign({ id: admin._id || admin.email, email: admin.email, role: admin.role || 'admin' }, JWT_SECRET, { expiresIn: '8h' })
    res.json({ ok: true, token, admin: { id: admin._id || admin.email, email: admin.email, name: admin.name || 'Admin' } })
  } catch (err) {
    res.status(500).json({ message: 'Login failed' })
  }
})

module.exports = router
