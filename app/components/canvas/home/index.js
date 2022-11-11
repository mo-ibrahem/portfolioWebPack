import Media from './media'
import { Plane, Transform } from 'ogl'
import map from 'lodash/map'
import GSAP from 'gsap'
export default class Home{
  constructor({gl, scene, sizes}){
    this.group = new Transform()
    this.sizes =sizes
    this.scene = scene
    this.gl = gl
    this.galleryElement = document.querySelector('.home__gallery')
    this.mediaElement = document.querySelectorAll('.home__gallery__media__image')

    this.createGeometry()
    this.createGallery()


    this.group.setParent(scene)

    this.x ={
      current: 0,
      target: 0,
      lerp: 0.1
    }
    this.y ={
      current: 0,
      target: 0,
      lerp: 0.1
    }
    this.scrollCurrent ={
      x: 0,
      y: 0,
    }
    this.scroll ={
      x: 0,
      y: 0
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

    this.galleryBounds = this.galleryElement.getBoundingClientRect()
    this.sizes = event.sizes
    this.gallerySizes = {
      height: this.galleryBounds.height / window.innerHeight * this.sizes.height,
      width: this.galleryBounds.width / window.innerWidth * this.sizes.width

    }
    // this.scroll.x = this.target.x = 0
    // this.scroll.y = this.target.y = 0
    map(this.medias, media => media.onResize(event, this.scroll))

  }

  onTouchDown({x,y}){
    this.scrollCurrent.x = this.scroll.x
    this.scrollCurrent.y = this.scroll.y
  }

  onTouchMove({x,y}){
    const xDistance = x.start - x.end
    const yDistance = y.start - y.end

    this.x.target = this.scrollCurrent.x - xDistance
    this.y.target = this.scrollCurrent.y - yDistance
  }

  onTouchUp({x,y}){

  }
  onWheel({pixelX,pixelY}){
    this.x.target += pixelX
    this.y.target += pixelY
  }
   // Animations
  show(){
    console.log("home show")
    map(this.medias, media => media.show())
  }
  hide(){
    map(this.medias, media => media.hide())
  }


  // Update
  update(){
    if(!this.galleryBounds) return
    this.x.current = GSAP.utils.interpolate(this.x.current, this.x.target, this.x.lerp)
    this.y.current = GSAP.utils.interpolate(this.y.current, this.y.target, this.y.lerp)

    if(this.scroll.x < this.x.current){
      this.x.direction = 'right'
    }else if(this.scroll.x > this.x.current){
      this.x.direction = 'left'
    }

    if(this.scroll.y < this.y.current){
      this.y.direction = 'top'
    }else if(this.scroll.y > this.y.current){
      this.y.direction = 'bottom'
    }


    this.scroll.x = this.x.current
    this.scroll.y = this.y.current

    map(this.medias, (media, index) => {

      const scaleX = media.mesh.scale.x / 2
      if(this.x.direction === 'left'){
        const x = media.mesh.position.x + scaleX
        if( x < -this.sizes.width/2){
          media.extra.x += this.gallerySizes.width
        }
      }
      else if(this.x.direction === 'right'){
        const x = media.mesh.position.x - scaleX
        if( x > (this.sizes.width/2)){
          media.extra.x -= this.gallerySizes.width
        }
      }


        const scaleY = media.mesh.scale.y / 2

        if(this.y.direction === 'top'){
          const y = media.mesh.position.y + scaleY
          if( y < -this.sizes.height/2){
            console.log('this element is out of top bounds')
            media.extra.y += this.gallerySizes.height
          }
        }
        else if(this.y.direction === 'bottom'){
          const y = media.mesh.position.y - scaleY
          if(y > (this.sizes.height/2)){
          media.extra.y -= this.gallerySizes.height
          }
        }

      media.update(this.scroll)
    })
  }
  // Destroyy
  destroy(){
    this.scene.removeChild(this.group)
  }
}