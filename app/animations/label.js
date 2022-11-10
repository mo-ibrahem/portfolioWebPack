import Animation from 'classes/animations'
import GSAP from 'gsap'
import each from 'lodash/each'
import { calculate, split } from 'utils/text'
export default class Label extends Animation{
  constructor({element, elements}){
    super({
      element,
      elements
    })
    split({ element: this.element, append: true })
    split({ element: this.element, append: true })
    this.elementLinesSpans = this.element.querySelectorAll('span span')
    this.onResize()
  }

  animateIn(){
    this.timelineIn = GSAP.timeline({delay: .5})
    GSAP.set(this.element,{
      autoAlpha: 1
    })
    each(this.elementLines, (line, index)=>{
      this.timelineIn.fromTo(line,{
        y: '100%'
      }
      ,{
        delay: index * .2,
        duration: 1.5,
        ease: 'expo.out',
        y:'0%'
      },0)
    })

  }

  animateOut(){
    GSAP.set(this.element,{
      autoAlpha: 0
    })
  }

  onResize(){
    this.elementLines = calculate(this.elementLinesSpans)
  }
}