import Component from 'classes/component'
import GSAP from 'gsap'
export default class buttons extends Component {
  constructor({element}) {
    super({element})
    this.path = element.querySelector('path:last-child')
    this.pathLength = this.path.getTotalLength()
    this.gsapPath = `${this.pathLength} ${this.pathLength}`
    this.timeline = GSAP.timeline({ paused: true })
    this.timeline.fromTo(this.path, {
      strokeDashoffset: this.pathLength,
      strokeDasharray: this.gsapPath,
    },
    {
      strokeDashoffset: 0,
      strokeDasharray: this.gsapPath,
    })
  }

  onMouseEnter(){
    console.log('onMouseEnter')
    this.timeline.play()
  }

  onMouseLeave(){
    console.log('onMouseLeave')
    this.timeline.reverse()

  }

  addEventListeners(){
    this.element.addEventListener('mouseenter', this.onMouseEnter.bind(this))
    this.element.addEventListener('mouseleave', this.onMouseLeave.bind(this))
  }

  removeEventListener(){
    this.element.removeEventListener('mouseenter', this.onMouseEnter.bind(this))
    this.element.removeEventListener('mouseleave', this.onMouseLeave.bind(this))
  }
}