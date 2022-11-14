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

    const image = this.element.querySelector('img')

    this.texture = window.TEXTURES[image.getAttribute('data-src')]


  }
  createProgram(){
    this.program = new Program(this.gl,{
      fragment,
      vertex,
      uniforms:{
        uAlpha: { value: 0 },
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
    this.updateX(scroll)
    this.updateY(scroll)
    this.extra = 0
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
  updateRotation(){
    this.mesh.rotation.z = GSAP.utils.mapRange(
      -this.sizes.width/2,
      this.sizes.width/2,
      Math.PI*.1,
      -Math.PI*.1,
      this.mesh.position.x
    )

  }

  updateScale(){
    this.width = this.bounds.width / window.innerWidth;
    this.height = this.bounds.height / window.innerHeight;

    this.mesh.scale.x = this.sizes.width * this.width
    this.mesh.scale.y = this.sizes.height * this.height



    // this.mesh.scale.x += GSAP.utils.mapRange(0, this.sizes.width / 2, .5, 0, Math.abs(this.mesh.position.x))
    // this.mesh.scale.y += GSAP.utils.mapRange(0, this.sizes.width / 2, .5, 0, Math.abs(this.mesh.position.x))


  }

  updateX(x = 0){
    this.x = (this.bounds.left + x) / window.innerWidth

    this.mesh.position.x = (-this.sizes.width / 2) + (this.mesh.scale.x / 2) + (this.x  * this.sizes.width) + this.extra

  }

  updateY(y = 0){
    this.y = (this.bounds.top + y) / window.innerHeight

    this.mesh.position.y = (this.sizes.height / 2) - (this.mesh.scale.y / 2) - (this.y  * this.sizes.height)
    this.mesh.position.y += Math.cos((this.mesh.position.x/this.sizes.width)*Math.PI*.1) * 40 - 40
  }

  update(scroll){
    if(!this.bounds) return

    this.updateRotation()
    this.updateScale()
    this.updateX(scroll)
    this.updateY(0)
  }

}