const express = require('express')
const app = express()
const decks = require('./decks')
const results = require('./results')

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Use API Routes
app.use(decks)
app.use(results)

// Export the server middleware
module.exports = {
  path: '/api',
  handler: app
}