const mongoose = require('mongoose')

const state = {
  members: [],
  payments: [],
  posts: [],
  admins: []
}

function isDbConnected() {
  return mongoose.connection.readyState === 1
}

function clone(value) {
  return JSON.parse(JSON.stringify(value))
}

function getState() {
  return state
}

function addAdmin(admin) {
  state.admins.push(admin)
  return admin
}

function findAdminByEmail(email) {
  return state.admins.find((item) => item.email === email) || null
}

function upsertMember(member) {
  const existingIndex = state.members.findIndex((item) => item.email === member.email)
  if (existingIndex >= 0) {
    state.members[existingIndex] = { ...state.members[existingIndex], ...member }
    return state.members[existingIndex]
  }
  state.members.push(member)
  return member
}

function listMembers() {
  return state.members
}

function upsertPayment(payment) {
  const existingIndex = state.payments.findIndex((item) => item._id === payment._id || item.id === payment.id)
  if (existingIndex >= 0) {
    state.payments[existingIndex] = { ...state.payments[existingIndex], ...payment }
    return state.payments[existingIndex]
  }
  state.payments.push(payment)
  return payment
}

function listPayments() {
  return state.payments
}

function addPost(post) {
  state.posts.unshift(post)
  return post
}

function listPosts() {
  return state.posts
}

module.exports = {
  isDbConnected,
  clone,
  getState,
  addAdmin,
  findAdminByEmail,
  upsertMember,
  listMembers,
  upsertPayment,
  listPayments,
  addPost,
  listPosts
}
