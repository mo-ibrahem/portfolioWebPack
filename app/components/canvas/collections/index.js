import Media from './media'
import { Plane, Transform } from 'ogl'
import map from 'lodash/map'
import GSAP from 'gsap'
import Prefix from 'prefix'
export default class Collections{
  constructor({gl, scene, sizes}){
    this.group = new Transform()
    this.sizes =sizes
    this.scene = scene
    this.gl = gl

    this.gallery = document.querySelector('.collections__gallery')
    this.transformPrefix = Prefix('transform')
    this.titlesElement = document.querySelector('.collections__titles')
    this.galleryElement = document.querySelector('.collections__gallery__wrapper')
    this.mediaElement = document.querySelectorAll('.collections__gallery__media')
    this.collectionsElementsActive = 'collections__article--active'
    this.collectionsElements = document.querySelectorAll('.collections__article')

    this.createGeometry()
    this.createGallery()


    this.group.setParent(scene)

    this.scroll = {
      current: 0,
      target: 0,
      start: 0,
      lerp: .10,
      velocity:1
    }
    this.show()

  }

  createGallery(){
    this.medias = map(this.mediaElement, (element, index) =>{
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
  createGeometry(){
    this.geometry = new Plane(this.gl)
  }

  //  EVENTS

  onResize(event){

    this.bounds = this.galleryElement.getBoundingClientRect()
    this.sizes = event.sizes

    // this.scroll.x = this.target.x = 0
    // this.scroll.y = this.target.y = 0

    this.scroll.limit = this.bounds.width - this.medias[0].element.clientWidth
    map(this.medias, media => media.onResize(event, this.scroll))

  }

  onTouchDown({x}){
    this.scroll.last = this.scroll.current
  }

  onTouchMove({x,y}){
    const Distance = x.start - x.end

    this.scroll.target = this.scroll.last - Distance
  }

  onTouchUp({x,y}){

  }
  onWheel({pixelY}){
    this.scroll.target += pixelY

  }
   // Animations
  show(){
    map(this.medias, media => media.show())
  }
  hide(){
    map(this.medias, media => media.hide())
  }
  // Changes
  onChange(index){
    this.index = index

    const selectedCollection = parseInt(this.mediaElement[this.index].getAttribute('data-index'))
    console.log(selectedCollection)

    map(this.collectionsElements, (element, index)=>{

      if(index === selectedCollection){
        element.classList.add(this.collectionsElementsActive)
      }
      else{
        element.classList.remove(this.collectionsElementsActive)
      }

    })

    this.titlesElement.style[this.transformPrefix] =  `translateY(${ -25 * selectedCollection}%) translate(-50%,-50%) rotate(90deg)`
    console.log(this.mediaElement[this.index].getAttribute('data-index'))

  }


  // Update
  update(){
    if(!this.bounds) return

    this.scroll.target = GSAP.utils.clamp(-this.scroll.limit, 0, this.scroll.target)
    this.scroll.current = GSAP.utils.interpolate(this.scroll.current, this.scroll.target, this.scroll.lerp)
    this.gallery.style[this.transformPrefix] = `translateX(${this.scroll.current}px)`
    if(this.scroll.target < this.scroll.current){
      this.scroll.direction = 'right'
    }else if(this.scroll.target > this.scroll.current){
      this.scroll.direction = 'left'
    }

    this.scroll.last = this.scroll.current

    map(this.medias, (media, index) => {

      media.update(this.scroll.current)
    })
    const index = Math.floor(Math.abs(this.scroll.current / this.scroll.limit) * this.medias.length)

    if(this.index !== index){
      console.log(index)

      this.onChange(index)
    }
  }
  // Destroyy
  destroy(){
    this.scene.removeChild(this.group)
  }
}