import { Component, Vue, Prop } from 'vue-property-decorator'
import { Card } from '@/types'
import flipper from '../flipper/flipper.vue'

@Component({
  name: 'card-deck',
  components: {
    flipper
  },
})
export default class CardDeck extends Vue {
  @Prop() card!:Card
  @Prop({ default: false }) visible!:boolean
  @Prop({ default: false }) autoInvokeTransition!:boolean
  @Prop({ default: 1 }) order!:number

  autoInvoke:boolean = false

  get frontCard () {
    const { card } = this
    return require(`~/assets/svg-cards/${card.shortRank}${card.shortSuit}.svg?data`)
  }

  get backCard () {
    const { card } = this
    return require(`~/assets/svg-cards/${['hearts', 'diamonds'].includes(card.suit as string) ? '2' : '1'}B.svg?data`)
  }

  mounted () {
    const { autoInvokeTransition } = this

    if (autoInvokeTransition) {
      setTimeout(() => {
        this.autoInvoke = true
      }, 500)
    }
  }

  render() {
    const { card } = this
    return (
      <flipper {...{
        props: {
          visible: this.autoInvokeTransition ? !this.autoInvoke : !this.visible,
          order: this.order
        }
      }}>
        <template slot="front">
          <div class={['deck-card']}>
            <span class={['card']}>
                <img {...{
                  attrs: {
                    src: this.frontCard
                  }
                }}/>
            </span>
          </div>
        </template>
        <template slot="back">
          <div class={['deck-card']}>
              <span class={['card']}>
                  <img {...{
                    attrs: {
                      src: this.backCard
                    }
                  }}/>
              </span>
            </div>
        </template>
      </flipper>
    )
  }
}
