import map from 'lodash/map'
import Media from './media'
import GSAP from 'gsap'
import { Transform } from 'ogl'
export default class Gallery {
  constructor({element, geometry, index, gl, scene, sizes}){
    this.element = element
    this.elementWrapper = element.querySelector('.about__gallery__wrapper')
    this.gl = gl
    this.geometry = geometry
    this.index = index
    this.scene = scene
    this.sizes = sizes

    this.group = new Transform()

    this.scroll = {
      current: 0,
      target: 0,
      start: 0,
      lerp: .10,
      velocity:1
    }

    this.createMedias()
    this.group.setParent(this.scene)
  }
  createMedias(){
    this.mediasElements = document.querySelectorAll('.about__gallery__media')
    this.medias = map(this.mediasElements,(element, index) =>{
      return new Media({
        element,
        geometry: this.geometry,
        index,
        gl: this.gl,
        scene: this.group,
        sizes: this.sizes
      })
    })
  }
  //  EVENETSS ____----------------------------------------------------------------

  onResize(event){

    this.bounds = this.elementWrapper.getBoundingClientRect()
    this.sizes = event.sizes
    this.width = this.bounds.width / window.innerWidth * this.sizes.width
    // this.scroll.current = 0
    // this.scroll.target = 0
    map(this.medias, media => media.onResize(event, this.scroll.current))

  }

  onTouchDown({x,y}){
    this.scroll.start = this.scroll.current
  }

  onTouchMove({x,y}){
    const Distance = x.start - x.end

    this.scroll.target = this.scroll.start - Distance
  }

  onTouchUp({x,y}){

  }
  onWheel({pixelX,pixelY}){

  }

  // Update
  update(scroll){
    if(!this.bounds) return

    const distance = (scroll.current - scroll.target) * .1
    const y = scroll.current / window.innerHeight
    if(this.scroll.current < this.scroll.target){
      this.direction = 'right'
      this.scroll.velocity = -1

    }else if(this.scroll.current > this.scroll.target){
      this.direction = 'left'
      this.scroll.velocity =1

    }

    this.scroll.target -= this.scroll.velocity
    this.scroll.target += distance
    this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, this.scroll.lerp)

    map(this.medias, (media, index) => {

      const scaleX = media.mesh.scale.x / 2 + .35
      if(this.direction === 'left'){
        const x = media.mesh.position.x + scaleX
        if( x < -this.sizes.width/2){
          media.extra += this.width
        }
      }
      else if(this.direction === 'right'){

        const x = media.mesh.position.x - scaleX
        if( x > (this.sizes.width/2)){
          media.extra -= this.width
        }
      }
      media.update(this.scroll.current)

      // media.mesh.position.y = Math.cos((media.mesh.position.x / this.wdith) * Math.PI) * 1 - 1
    })
    this.group.position.y = y * this.sizes.height
  }
  // Animations
  show(){
    map(this.medias, media => media.show())
  }
  hide(){
    map(this.medias, media => media.hide())
  }
// destroy
  destroy(){
    this.scene.removeChild(this.group)
  }
}