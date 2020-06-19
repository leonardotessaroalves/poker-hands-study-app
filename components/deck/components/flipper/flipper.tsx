import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'flipper'
})
export default class Flipper extends Vue {
  @Prop({ default: false }) visible!:boolean
  @Prop({ default: 1 }) order!:number
  render() {
    return (
      <div class={['flip-container', { active: this.visible }]} {...{
        style: {
          zIndex: this.order
        }
      }}>
        <div class="flipper">
          {this.$slots.front && (
            <div class={'front'}>{this.$slots.front}</div>
          )}
          {this.$slots.back && (
            <div class={'back'}>{this.$slots.back}</div>
          )}
        </div>
      </div>
    )
  }
}
