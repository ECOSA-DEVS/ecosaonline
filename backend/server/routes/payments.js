const express = require('express')
const router = express.Router()
const Payment = require('../models/Payment')
const Member = require('../models/Member')
const { upsertPayment, listPayments, upsertMember } = require('../utils/store')
const { generateReceiptPdf, sendSms, sendWhatsApp, sendEmail } = require('../utils/notifications')

function generateMembershipNumber() {
  const stamp = Date.now().toString().slice(-6)
  return `ECOSA-${stamp}`
}

router.get('/', async (req, res) => {
  try {
    const payments = await Payment.find().sort({ createdAt: -1 }).catch(() => [])
    res.json(payments.length ? payments : listPayments())
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch payments' })
  }
})

router.post('/initiate', async (req, res) => {
  try {
    const { member, payment } = req.body

    const newPayment = new Payment({
      memberName: member?.name || '',
      email: (member?.email || '').toLowerCase(),
      purpose: payment?.purpose || 'Membership',
      amount: payment?.amount || 0,
      currency: payment?.currency || 'UGX',
      method: payment?.method || 'mobile',
      phone: payment?.phone || member?.phone || '',
      status: 'pending'
    })

    try {
      await newPayment.save()
    } catch (err) {
      upsertPayment({ ...newPayment.toObject ? newPayment.toObject() : newPayment, _id: newPayment._id || Date.now().toString() })
    }
    res.json({ ok: true, paymentId: newPayment._id })
  } catch (err) {
    res.status(500).json({ message: 'Failed to initiate payment' })
  }
})

router.post('/webhook', async (req, res) => {
  try {
    const signature = req.headers['x-flutterwave-signature'] || ''
    const secret = process.env.FLUTTERWAVE_WEBHOOK_SECRET || ''
    if (secret && signature && signature !== secret) {
      return res.status(401).json({ message: 'Invalid webhook signature' })
    }

    const { paymentId, status, gatewayReference, txRef, transaction_id } = req.body
    const payment = await Payment.findById(paymentId || txRef).catch(() => null)
    if (!payment) return res.status(404).json({ message: 'Payment not found' })

    payment.status = status === 'successful' || status === 'paid' ? 'paid' : 'failed'
    payment.gatewayReference = gatewayReference || transaction_id || txRef || ''
    try {
      await payment.save()
    } catch (err) {
      upsertPayment(payment)
    }

    let member = null
    if (payment.memberId) {
      member = await Member.findById(payment.memberId).catch(() => null)
    }

    if (!member && payment.status === 'paid') {
      member = await Member.findOne({ email: payment.email }).catch(() => null)
      if (!member) {
        member = new Member({
          name: payment.memberName || '',
          email: payment.email,
          phone: payment.phone || '',
          paymentStatus: 'paid'
        })
      } else {
        member.paymentStatus = 'paid'
      }
      if (!member.membershipNumber) {
        member.membershipNumber = generateMembershipNumber()
      }
      try {
        await member.save()
      } catch (err) {
        upsertMember(member)
      }
      if (!payment.memberId && member._id) {
        payment.memberId = member._id
        try {
          await payment.save()
        } catch (err) {
          upsertPayment(payment)
        }
      }
    }

    if (member) {
      member.paymentStatus = payment.status === 'paid' ? 'paid' : 'failed'
      if (payment.status === 'paid' && !member.membershipNumber) {
        member.membershipNumber = generateMembershipNumber()
      }
      try {
        await member.save()
      } catch (err) {
        upsertMember(member)
      }

      if (payment.status === 'paid') {
        const { filePath, fileName } = generateReceiptPdf(member, payment)
        payment.receiptUrl = `/uploads/${fileName}`
        payment.emailSent = true
        payment.smsSent = true
        payment.whatsappSent = true
        try {
          await payment.save()
        } catch (err) {
          upsertPayment(payment)
        }

        const message = `Your ECOSA payment was successful. Membership number: ${member.membershipNumber}`
        await sendSms(member.phone, message)
        await sendWhatsApp(member.phone, message)
        await sendEmail(member.email, 'ECOSA payment successful', `<p>Thank you for paying. Your membership number is ${member.membershipNumber}</p>`)
      }
    }

    res.json({ ok: true, payment })
  } catch (err) {
    res.status(500).json({ message: 'Webhook processing failed' })
  }
})

module.exports = router
