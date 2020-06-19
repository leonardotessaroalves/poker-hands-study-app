import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'button'
})
export default class Result extends Vue {
  @Prop({ default: false }) draw!:boolean
  @Prop({ default: '' }) rank!:string
  @Prop({ default: '' }) name!:string

  render() {
    const { draw, name, rank } = this
    return (
      <span>
        {(!draw) ? (
          <div class={['winner']}>
            <span>Ganhador: {name} </span>
            <span>Rank: {rank} </span>
          </div>
          ) : (
          <span>Draw game!</span>
        )}
      </span>
    )
  }
}
