import Media from './media'
import { Plane, Transform } from 'ogl'
import map from 'lodash/map'
export default class Home{
  constructor({gl, scene}){
    this.group = new Transform()
    this.gl = gl
    this.medias = document.querySelectorAll('.home__gallery__media__image')

    this.createGeometry()
    this.createGallery()

    this.group.setParent(scene)

  }

  createGallery(){
    map(this.medias, (element, index) =>{
      return new Media({
        element,
        geometry: this.geometry,
        index,
        gl: this.gl,
        scene: this.group
      })
    })
  }
  createGeometry(){
    this.geometry = new Plane(this.gl)
  }
}