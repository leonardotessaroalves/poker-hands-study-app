import { Component, Vue, Prop } from 'vue-property-decorator'
import { Card } from '@/types'
import DeckCard from '@/components/deck/components/card/card.vue'

@Component({
  name: 'board',
  components: {
    DeckCard
  },
})
export default class Board extends Vue {
  @Prop({ default: () => ([]) }) cards!:Card[]

  get moreThanThree () {
    return this.cards.length > 3
  }

  render() {
    return (
      <div class={['board']}>
        <el-row class={['j-center']} {...{
          props: {
            type: 'flex'
          }
        }}>
          {this.cards.map((card, i) => {
            return (
              <el-col {...{
                props: {
                  span: 4
                }
              }}>
                <deck-card {...{
                  props: {
                    card: card,
                    visible: this.moreThanThree,
                    autoInvokeTransition: i >= 3,
                    order: i + 1
                  },
                  style: {
                    transitionDelay: `${(i < 3 ? i : 1) * 0.175}s`
                  }
                }}/>
              </el-col>
            )
          })}
        </el-row>
      </div>
    )
  }
}
