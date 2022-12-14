import Animation from 'classes/animations'
import GSAP from 'gsap'
import each from 'lodash/each'
import { calculate, split } from 'utils/text'
export default class Highlight extends Animation{
  constructor({element, elements}){
    super({
      element,
      elements
    })

  }

  animateIn(){
    this.timelineIn = GSAP.timeline({delay: .5})
    this.timelineIn.fromTo(this.element,{
      autoAlpha: 0,
      scale: 1.2,
    },{
      autoAlpha: 1,
      scale: 1,
      ease: 'expo.out',
      duration:1.5,
    })

  }

  animateOut(){
    GSAP.set(this.element,{
      autoAlpha: 0
    })
  }
  onResize(){
    
  }

}