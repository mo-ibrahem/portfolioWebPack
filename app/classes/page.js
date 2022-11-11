import GSAP from 'gsap'
import Prefix from 'prefix'
import each from 'lodash/each'
import map from 'lodash/map'
import Title from 'animations/title'
import Label from 'animations/label'
import Highlight from 'animations/highlight'
import Paragraph from 'animations/paragraphs'
import {ColorsManager} from 'classes/colors'
import AsyncLoad from 'classes/asyncLoad'
export default class Page {
  constructor({
        element,
        elements,
        id,
      })
  {
    this.selector = element;
    this.selectorChildren = {
      ...elements,
      animationsTitles: '[data-animation="title"]',
      animationsHighlights: '[data-animation="highlight"]',
      animationsParagraphs: '[data-animation="paragraph"]',
      animationsLabels: '[data-animation="label"]',
      preloaders: '[data-src]'
    };
    this.id = id
    this.transformPrefix = Prefix('transform')

    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 12000,
    }


  }
  create () {
    this.element = document.querySelector(this.selector);
    this.elements = {}
    this.scroll = {
      current: 0,
      target: 0,
      last: 0,
      limit: 0,

    }

    each(this.selectorChildren,(entry, key) => {
      if( entry instanceof window.HTMLElement || entry instanceof window.NodeList || Array.isArray(entry)){
        this.elements[key] = entry
      } else{
        this.elements[key] = document.querySelectorAll(entry)

        if(this.elements[key].length === 0){
          this.elements[key] = null
        } else if( this.elements[key].length === 1){
          this.elements[key] = document.querySelector(entry)
        }
      }

    })

    this.createAnimations()
    this.createAsyncLoad()
  }
  createAsyncLoad(){
    this.preloaders = map(this.elements.preloaders, element =>{
      return new AsyncLoad({element})
    })
  }
  createAnimations(){
    this.animations = []
    // labels
    this.animationsHighlights = map(this.elements.animationsHighlights, element =>{
      return new Highlight({
        element
      })
    })
    this.animations.push(...this.animationsHighlights)
    // highlights
    this.animationsTitles = map(this.elements.animationsTitles, element =>{
      return new Title({
        element
      })
    })
    this.animations.push(...this.animationsTitles)

    // Paragraphs
    this.animationsParagraphs = map(this.elements.animationsParagraphs, element =>{
      return new Paragraph({
        element
      })
    })
    this.animations.push(...this.animationsParagraphs)

    // labels
    this.animationsLabels = map(this.elements.animationsLabels, element =>{
      return new Label({
        element
      })
    })
    this.animations.push(...this.animationsLabels)
  }
  show(){
    return new Promise(resolve =>{
      this.animationIn = GSAP.timeline()
      ColorsManager.change({
          backgroundColor: this.element.getAttribute('data-background'),
          color: this.element.getAttribute('data-color')
        }
      )
      this.animationIn.fromTo(this.element,{
        autoAlpha: 0,
        onComplete: resolve
      },{
        autoAlpha: 1,
      })
      this.animationIn.call(_=>{
        this.addEventListeners()
        resolve()
      })
      this.createAsyncLoad()
    })
  }

  hide(){
    return new Promise(resolve =>{
      this.destroy()
      this.animationOut = GSAP.timeline()

      this.animationOut.to(this.element,{
        autoAlpha: 0,
        onComplete: resolve
      })
    })
  }
  onWheel({pixelY }){
    this.scroll.target += pixelY
  }

  onResize(){
    if(this.elements.wrapper){
      this.scroll.limit = this.elements.wrapper.clientHeight - window.innerHeight
    }
    each(this.animations, animation => animation.onResize())
  }

  update(){

    this.scroll.target = GSAP.utils.clamp(0, this.scroll.limit, this.scroll.target)
    this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, 0.1)

    if(this.scroll.current< 0.01){
      this.scroll.current = 0
    }
    if(this.elements.wrapper){
      this.elements.wrapper.style[this.transformPrefix] = `translateY(-${this.scroll.current}px)`
    }
  }
  addEventListeners(){
  }

  removeEventListeners(){

  }
  destroy(){
    this.removeEventListeners();
  }
}