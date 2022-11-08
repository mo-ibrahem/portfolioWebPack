import Animation from 'classes/animations'
import GSAP from 'gsap'
export default class Title extends Animation{
  constructor({element, elements}){
    super({
      element,
      elements
    })
  }

  animateIn(){
    GSAP.fromTo(this.element,{
      autoAlpha: 0
    },{
      autoAlpha: 1,
      duration: 1.5,
    })
  }
  animateOut(){
    GSAP.set(this.element,{
      autoAlpha: 0
    })
  }
}