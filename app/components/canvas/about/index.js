import Gallery from './Gallery'
import { Plane, Transform } from 'ogl'
import map from 'lodash/map'
export default class About{
  constructor({gl, scene, sizes}){
    this.group = new Transform()
    this.sizes =sizes
    this.gl = gl

    this.createGeometry()
    this.createGalleries()

    this.group.setParent(scene)

    this.show()

  }

  createGalleries(){
    this.galleriesElements = document.querySelectorAll('.about__gallery')

    this.galleries = map(this.galleriesElements, (element, index) =>{
      return new Gallery({
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
    map(this.galleries, gallery => gallery.onResize(event))
  }

  onTouchDown(event){
    map(this.galleries, gallery => gallery.onTouchDown(event))

  }

  onTouchMove(event){
    map(this.galleries, gallery => gallery.onTouchMove(event))

  }

  onTouchUp(event){
    map(this.galleries, gallery => gallery.onTouchUp(event))

  }
  onWheel({pixelX,pixelY}){

  }
  // Animations
  show(){
    map(this.galleries, gallery => gallery.show())
  }
  hide(){
    map(this.galleries, gallery => gallery.hide())
  }

  // Update
  update(scroll){
    const y = scroll.current / window.innerHeight
    map(this.galleries, gallery => gallery.update(scroll))

  }
  // Destroy --------------------------------
  destroy(){
    map(this.galleries, gallery => gallery.destroy())
  }
}