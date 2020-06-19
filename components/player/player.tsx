import { Component, Vue, Prop } from 'vue-property-decorator'
import { Card } from '@/types'
import DeckCard from '@/components/deck/components/card/card.vue'
import { isEmpty } from 'lodash'
@Component({
  name: 'player',
  components: {
    DeckCard
  },
})
export default class Player extends Vue {
  @Prop({ default: () => ([]) }) cards!:Card[]
  @Prop({ default: () => ([]) }) board!:Card[]
  @Prop({ default: false }) visible!:boolean
  @Prop({ default: () => ({}) }) result:any
  @Prop({ default: '' }) name!:string

  render() {
    return (
      <div class={['player']}>
        <div class={['name']}>
            {this.name}
          </div>
        <div class={['cards']}>
          {this.cards.map((card, i) => {
            return (
              <deck-card {...{
                props: {
                  card: card,
                  visible: this.visible,
                  order: i + 1
                },
                style: {
                  transitionDelay: `${i * 0.175}s`
                }
              }}/>
            )
          })}
        </div>
        { !isEmpty(this.result) && (
          <div class={['result']}>
            {this.result?.name}
          </div>
        ) }
      </div>
    )
  }
}
