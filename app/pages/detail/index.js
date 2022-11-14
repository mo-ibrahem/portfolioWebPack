import Page from 'classes/Page';
import Button from 'classes/Button';
export default class Detail extends Page{

  constructor() {
    super({
      id: 'detail',
      wrapper: '.detail__wrapper',
      element:'.detail',
      elements:{
        button: '.detail__button'
      }
    })
  }
  create(){
    super.create()

    this.link = new Button({
      element: this.elements.button
    })

  }
  destroy(){
    super.destroy()
    this.link.removeEventListener()

  }
}