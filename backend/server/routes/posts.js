const express = require('express')
const router = express.Router()
const Post = require('../models/Post')
const { addPost: addToStore, listPosts } = require('../utils/store')

router.get('/', async (req, res) => {
  try {
    const posts = await Post.find({ isPublished: true }).sort({ createdAt: -1 }).catch(() => [])
    res.json(posts.length ? posts : listPosts())
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch posts' })
  }
})

router.post('/', async (req, res) => {
  try {
    const post = new Post(req.body)
    try {
      await post.save()
    } catch (err) {
      addToStore({ ...req.body, _id: req.body.id || Date.now().toString() })
    }
    res.status(201).json(post)
  } catch (err) {
    res.status(500).json({ message: 'Failed to create post' })
  }
})

router.put('/:id', async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(req.params.id, req.body, { new: true })
    res.json(post)
  } catch (err) {
    res.status(500).json({ message: 'Failed to update post' })
  }
})

router.delete('/:id', async (req, res) => {
  try {
    await Post.findByIdAndDelete(req.params.id)
    res.json({ ok: true })
  } catch (err) {
    res.status(500).json({ message: 'Failed to delete post' })
  }
})

module.exports = router
