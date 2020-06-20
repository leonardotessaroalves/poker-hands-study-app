import { Component, Vue, Prop, Watch } from 'vue-property-decorator'
import { Card } from '@/types'
import DeckCard from '@/components/deck/components/card/card.vue'
import { clone } from 'lodash'

@Component({
  name: 'deck',
  components: {
    DeckCard
  },
})
export default class Deck extends Vue {
  @Prop({ default: () => ([]) }) cards!:Card[]
  
  innerData: Card[] = []
  inititalSize: number = 0
  
  get matchCards() {
    return this.innerData.filter(item => item === this.cards.find(o => o === item))
  }

  get getMore() {
    return this.matchCards.length === 0 && this.cards.length === this.inititalSize
  }

  distribute () {
    const cloned = clone(this.cards)
    this.inititalSize = cloned.length
    let toReverse =  cloned.slice(1, 13)
    this.innerData = toReverse.reverse()
  }
  created () {
    if (this.cards) {
      this.distribute()
    } 
  }

  render() {
    return (
      <div class={['deck-holder']}>
        <transition-group name="insert">f
          
            {this.matchCards.map((card, i) => {
              return (
                <div class={['deck-item']} {...{
                  key: `card-${card.id}`,
                  style: {
                    top: `${i}px`,
                    left: `${i + i*2}px`
                  }
                }}>
                  <div class={['item']}>
                    <deck-card {...{
                      props: {
                        card: card,
                        visible: false,
                        order: i + 1
                      }
                    }}/>
                  </div>
                </div>
              )
            })}
          
        </transition-group>
      </div>
    )
  }

  @Watch('getMore')
  watcherGetMore (val: boolean) {
    if (val) this.distribute()
  }
}
