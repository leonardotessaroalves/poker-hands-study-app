const express = require('express')
const router = express.Router()
const shuffle = require('lodash/shuffle')
const utils = require('../utils')

router.get('/deck', (req, res) => {
    let totalNaipes = 4
    let totalCartas = 13
    let index = 0
    let deck = []

    while (index < totalCartas * totalNaipes) {
        index++
        let naipe = index % totalNaipes || totalNaipes
        let value = index % totalCartas || totalCartas
        deck.push({
            id: index,
            naipe,
            value,
            rank: utils.ranks[value - 1],
            suit: utils.suits[naipe - 1],
            shortRank: utils.shortRanks[value - 1],
            shortSuit: utils.shortSuits[naipe - 1]
        })
    }
	res.json(shuffle(deck))
})

module.exports = router