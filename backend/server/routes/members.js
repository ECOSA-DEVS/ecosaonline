const express = require('express')
const router = express.Router()
const Member = require('../models/Member')
const { upsertMember, listMembers, clone } = require('../utils/store')

router.get('/', async (req, res) => {
  try {
    const query = { paymentStatus: 'paid' }
    if (req.query.all === 'true') {
      delete query.paymentStatus
    }

    const members = await Member.find(query).sort({ createdAt: -1 }).catch(() => [])
    const result = members.length ? members : listMembers().filter((m) => m.paymentStatus === 'paid' || m.membershipNumber)
    res.json(result)
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch members' })
  }
})

router.post('/', async (req, res) => {
  try {
    const existing = await Member.findOne({ email: req.body.email }).catch(() => null)
    if (existing) {
      Object.assign(existing, req.body)
      try {
        await existing.save()
      } catch (err) {
        // fall back to memory store
      }
      return res.json(existing)
    }

    const member = new Member(req.body)
    try {
      await member.save()
    } catch (err) {
      return res.status(201).json(upsertMember({ ...req.body, _id: req.body.id || Date.now().toString() }))
    }
    res.status(201).json(member)
  } catch (err) {
    res.status(500).json({ message: 'Failed to create member' })
  }
})

module.exports = router
