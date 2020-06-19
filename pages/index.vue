<template>
  <div class="container">
    <h1 class="title"> Leonardo Poker App </h1>
    
    <el-row type="flex">
      <el-col :span="6">
        <player :name="player1.name" :cards="player1.cards" :visible="player1.visible" :result="player1.result" />
      </el-col>

      <el-col :span="12">
        <board :cards="underBoard.cards" />
      </el-col>

      <el-col :span="6">
        <player :name="player2.name" :cards="player2.cards" :visible="player2.visible" :result="player2.result" />
      </el-col>
    </el-row>

    <el-row>
      <custom-button v-if="!started" label="Dar cartas" @click="startGame" />
      <custom-button v-else-if="underBoard.cards.length < 5" label="Cartas na mesa" @click="putOnBoard" />
      <custom-button v-else-if="!player2.visible" label="Hack" @click="showOponentCards" />
      <custom-button v-else label="Ver resultados" @click="calculateWinner" />
    </el-row>

    <iframe src="~/assets/audio/audio-game.mp3" type="audio/mp3" allow="autoplay" style="display:none"></iframe>
    
    <audio id="audio">
      <source src="~/assets/audio/audio-game.ogg" type="audio/ogg">
      <source src="~/assets/audio/audio-game.mp3" type="audio/mpeg">
    </audio>
  </div>
</template>

<script lang="ts">
import { Component, Vue, Prop } from 'vue-property-decorator'
import Player from '@/components/player/player'
import Board from '@/components/board/board'
import CustomButton from '@/components/button/button'
import Result from '@/components/result/result'
import { Card } from '../types'
import { clone } from 'lodash'
// import { Card, SuitEnum } from '@/types'

const player1Defs = {
  name: 'Você',
  cards: [],
  board: [],
  visible: true,
  result: undefined
}

const player2Defs = {
  name: 'NPC',
  cards: [],
  board: [],
  visible: false,
  result: undefined
}

const underBoardDefs = {
  cards: []
}

@Component({
  name: 'deck',
  components: {
    Player,
    Board,
    CustomButton,
    Result
  },
   async asyncData({ $axios }:any) {
    const deck = await $axios.$get('deck')
    return { deck }
  }
})
export default class Main extends Vue {
  player1:any = { ...player1Defs }

  player2:any = { ...player2Defs }

  underBoard:any = { ...underBoardDefs }

  started: boolean = false

  deck:Card[] = []

  removeFromDeck (index:number) {
    this.deck = this.deck.filter((_item, i) => {
      return i > index
    })
  }

  startGame () {
    let audio:any = document.getElementById("audio");
    audio.volume = 0.07
    audio.play()

    this.started = true

    let cloneDeck:any = clone(this.deck)
    let cardsPlayer1 = cloneDeck.slice(0, 2)
    this.player1.cards = cardsPlayer1

    let cardsPlayer2 = cloneDeck.slice(2, 4)
    this.player2.cards = cardsPlayer2

    this.removeFromDeck(4)
  }

  putOnBoard () {
    let cloneDeck:any = clone(this.deck)
    let cardsOnBoard = []
    if (this.underBoard.cards.length < 3) {
      cardsOnBoard = cloneDeck.slice(0, 3)
      this.underBoard.cards = cardsOnBoard
      this.removeFromDeck(3)
    } else {
      cardsOnBoard = cloneDeck[0]
      this.underBoard.cards.push(cardsOnBoard)
      this.removeFromDeck(1)
    }
  }

  showOponentCards () {
    this.player2.visible = true
  }

  async calculateWinner () {
    let player1Stats = await this.$axios.$post('result', { cards: [...this.player1.cards, ...this.underBoard.cards ]})
    let player2Stats = await this.$axios.$post('result', { cards: [...this.player2.cards, ...this.underBoard.cards ]})

    this.player1.result = player1Stats.ranks
    this.player2.result = player2Stats.ranks

    let rank1 =  player1Stats.ranks
    let rank2 =  player2Stats.ranks
    let winner = rank1.value > rank2.value
    let isADraw = rank1.value === rank2.value

    this.openModalWinner({
      name: winner ? 'Player 1' : 'Player 2',
      draw: isADraw,
      rank: winner ? rank1.name : rank2.name
    })
  }

  async reset () {
    this.player1 = { ...player1Defs }
    this.player2 = { ...player2Defs }
    this.underBoard = { ...underBoardDefs }

    this.deck = await this.$axios.$get('deck')
    this.started = false
  }

  openModalWinner (props:any) {
    const h = this.$createElement
    const newEl = h('Result', { props }, [])
    this.$msgbox({
      title: 'Resultados!',
      message: newEl,
      showCancelButton: false,
      confirmButtonText: 'Reiniciar',
      closeOnClickModal: false,
      closeOnPressEscape: false,
      closeOnHashChange: false,
      beforeClose: (action, instance, done) => {
        if (action === 'confirm') {
          instance.confirmButtonLoading = true;
          instance.confirmButtonText = 'Loading...'
          setTimeout(() => {
            done()
            setTimeout(() => {
              instance.confirmButtonLoading = false
            }, 300)
          }, 3000)
        } else {
          done()
        }
      }
    }).then(action => {
      this.reset()
    });
  }

}
</script>

<style lang="scss">
@import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');

#audio {
  // opacity: 0;
}

.container {
  margin: 0 auto;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  justify-content: center;
  align-items: center;  
  text-align: center;
  background: url('https://cdn11.bigcommerce.com/s-c1tzcg0txe/products/8381/images/9242/Ozone_Blue__63799.1523637102.500.750.jpg?c=2');

  .title {
    color: #002533;
    font-size: 48px;
    padding: 20px 0;
    font-family: 'Press Start 2P', cursive;
    text-shadow: -3px -2px black, 1px 1px #00d6ff;
    margin-bottom: 50px;
  }
  .el-row {
    width: -webkit-fill-available;
  }
}
</style>
