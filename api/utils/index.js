const _ranks = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'jack', 'queen', 'king', 'ace']
const _shortRanks = ['2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K', 'A']
const _suits = ['spades', 'hearts', 'diamonds', 'clubs']
const _shortSuits = ['S', 'H', 'D', 'C']

function _result (cards, name = undefined, value = undefined) {
    return {
        cards: cards,
        name: name || 'nothing',
        value: value || 0
    }
}

function _sanitise (allCards) {
    let cards = [].concat.apply([], allCards)
    cards = cards.filter((card) => !!(_ranks.indexOf(card.rank) > -1 && card.suit))
    return cards
}

function _combinations (cards, groups) {
    let result = []
    if (groups > cards.length) return result
    if (groups == cards.length) return [cards]
    if (groups == 1) return cards.map((card) => [card])
    for (let i = 0; i < cards.length - groups; i++) {
        let head = cards.slice(i, (i + 1))
        let tails = _combinations(cards.slice(i + 1), (groups - 1))
        for (let tail of tails) {
            result.push(head.concat(tail))
        }
    }
    return result
}

function _ranked (cards) {
    let result = []
    for (let card of cards) {
        let r = _ranks.indexOf(card.rank)
        result[r] = result[r] || []
        result[r].push(card)
    }
    result = result.filter((rank) => !!rank)
    result.reverse()
    result.sort((a, b) => a.length > b.length ? -1 : a.length < b.length ? 1 : 0)
    return result
}

function _isFlush (cards) {
    let suit = cards[0].suit
    for (let card of cards) {
        if (card.suit != suit) return false
    }
    return true
}

function _isStraight (ranked) {
    if (!ranked[4]) return false
    if (ranked[0][0].rank == 'ace' && ranked[1][0].rank == '5' && ranked[4][0].rank == '2') {
        ranked.push(ranked.shift())
        return true
    }
    let r0 = _ranks.indexOf(ranked[0][0].rank)
    let r4 = _ranks.indexOf(ranked[4][0].rank)
    return (r0 - r4) == 4
}

function _value (ranked, primary) {
    let str = ''
    for (let rank of ranked) {
        let r = _ranks.indexOf(rank[0].rank)
        let v = (r < 10 ? '0' : '') + r
        for (let i = 0; i < rank.length; i++) {
            str += v
        }
    }
    return (primary * 10000000000) + parseInt(str)
}

function _calculate (cards) {
    let ranked = _ranked(cards)
    let isFlush = _isFlush(cards)
    let isStraight = _isStraight(ranked)
    if (isStraight && isFlush && ranked[0][0].rank == 'ace') return _result(cards, 'Royal flush', _value(ranked, 9))
    else if (isStraight && isFlush) return _result(cards, 'Sequencia flush', _value(ranked, 8))
    else if (ranked[0].length == 4) return _result(cards, 'Quadra', _value(ranked, 7))
    else if (ranked[0].length == 3 && ranked[1].length == 2) return _result(cards, 'full house', _value(ranked, 6))
    else if (isFlush) return _result(cards, 'flush', _value(ranked, 5))
    else if (isStraight) return _result(cards, 'sequencia', _value(ranked, 4))
    else if (ranked[0].length == 3) return _result(cards, 'Trinca', _value(ranked, 3))
    else if (ranked[0].length == 2 && ranked[1].length == 2) return _result(cards, 'Dupla', _value(ranked, 2))
    else if (ranked[0].length == 2) return _result(cards, 'Par', _value(ranked, 1))
    else return _result(cards, 'Carta mais alta', _value(ranked, 0))
}

function score (...allCards) {
    let cards = _sanitise(allCards)
    let best = _result(cards)
    for (let combination of _combinations(cards, 5)) {
        let result = _calculate(combination)
        if (result.value > best.value) best = result
    }
    return best
}

module.exports = {
    score,
    ranks: _ranks,
    shortRanks: _shortRanks,
    suits: _suits,
    shortSuits: _shortSuits
}