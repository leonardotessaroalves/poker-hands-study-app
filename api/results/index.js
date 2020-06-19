const express = require('express')
const router = express.Router()
const utils = require('../utils')

router.post('/result', (req, res) => {
    const score = utils.score(req.body.cards)
	res.json({
        ranks: score
    })
})

module.exports = router