import { Mesh, Program } from 'ogl'
import vertex from 'shaders/plane-vertex.glsl';
import fragment from 'shaders/plane-fragment.glsl';
import GSAP from 'gsap'

export default class {
  constructor({element, geometry, index, gl, scene, sizes}){
    this.element = element
    this.gl = gl
    this.geometry = geometry
    this.index = index
    this.scene = scene
    this.sizes = sizes

    this.extra = {
      x: 0,
      y: 0
    }

    this.createTexture()
    this.createProgram()
    this.createMesh()

  }

  createTexture (){
    const image = this.element.querySelector('.collections__gallery__media__image')
    this.texture = window.TEXTURES[image.getAttribute('data-src')]
  }

  createProgram(){
    this.program = new Program(this.gl,{
      fragment,
      vertex,
      uniforms:{
        uAlpha: { value:0 },
        tMap: { value: this.texture }
      }
    })
  }

  createMesh(){
    this.mesh = new Mesh(this.gl,{
      geometry: this.geometry,
      program: this.program
    })

    this.mesh.setParent(this.scene)

  }

  createBounds({sizes}){
    this.bounds = this.element.getBoundingClientRect()
    this.sizes = sizes
    this.updateScale(sizes)
    this.updateX()
    this.updateY()
  }


   // Events
   onResize(sizes, scroll){
    this.createBounds(sizes)
    this.updateX(scroll && scroll.x)
    this.updateY(scroll && scroll.y)
    this.extra = {
      x: 0,
      y: 0
    }
  }


  // Animations
  show(){
    GSAP.fromTo(this.program.uniforms.uAlpha,{
      value: 0,
    },{
      value: 1,
    })
  }

  hide(){
    GSAP.to(this.program.uniforms.uAlpha,{
      value: 0,
    })
  }


  // Loop
  updateScale({ height, width }){
    this.width = this.bounds.width / window.innerWidth;
    this.height = this.bounds.height / window.innerHeight;

    this.mesh.scale.x = this.sizes.width * this.width
    this.mesh.scale.y = this.sizes.height * this.height
  }

  updateX(x = 0){
    this.x = (this.bounds.left + x) / window.innerWidth
    this.y = (this.bounds.top ) / window.innerHeight


    this.mesh.position.x = (-this.sizes.width / 2) + (this.mesh.scale.x / 2) + (this.x  * this.sizes.width) + this.extra.x
    this.mesh.position.y = (Math.cos((this.mesh.position.x/this.sizes.width)*Math.PI*.075) * 75 - 75 ) + this.y

  }

  updateY(y = 0){

    // this.mesh.position.y = (this.sizes.height / 2) - (this.mesh.scale.y / 2) - (this.y  * this.sizes.height) + this.extra.y
  }

  update(scroll){
    if(!this.bounds) return
    this.updateX(scroll)
    this.updateY(0)
  }
}