import { Component, Vue, Prop } from 'vue-property-decorator'

@Component({
  name: 'custom-button'
})
export default class CustomButton extends Vue {
  @Prop({ default: '' }) label!:string

  render() {
    const { label } = this
    return (
      <span class='start-btn' {...{
        on: {
          click: this.$listeners.click
        }
      }}>{label}</span>
    )
  }
}
