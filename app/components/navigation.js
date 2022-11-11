import Component from 'classes/component'
import GSAP from 'gsap'
import {COLOR_WHITE, COLOR_BRIGHT_GREY} from 'utils/color'
export default class Navigation extends Component {
  constructor({template}) {
    super({
      element: '.navigation',
      elements:{
        items: '.navigation__list__item',
        links: '.navigation__list__link'
      }
    });
    this.onChange(template)
  }

  onChange(template){
    console.log(template)
    if( template.url === 'about' || template === 'about'){
      GSAP.to(this.element, {
        color: COLOR_BRIGHT_GREY,
        duration: 1.5
      })
      GSAP.to(this.elements.items[0], {
        autoAlpha: 1,
        duration: .75,
        delay:.75

      })
      GSAP.to(this.elements.items[1], {
        autoAlpha: 0,
        duration: .75,

      })
    }else{
      GSAP.to(this.element, {
        color: COLOR_WHITE,
        duration: 1.5
      })
      GSAP.to(this.elements.items[0], {
        autoAlpha: 0,
        duration: .75

      })
      GSAP.to(this.elements.items[1], {
        autoAlpha: 1,
        duration: .75,
        delay:.75
      })
    }

  }
}