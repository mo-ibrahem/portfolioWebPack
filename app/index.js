import each from 'lodash/each'
import Preloader from 'components/preloader'
import Navigation from 'components/navigation'
import Canvas from 'components/Canvas'
import NormalizeWheel from 'normalize-wheel'

import About from 'pages/about'
import Detail from 'pages/detail'
import Collection from 'pages/collections'
import Home from 'pages/home'
class App{
  constructor(){
    this.createContent()
    this.createPreloader()
    this.createNavigation()
    this.createPages()
    this.createCanvas()
    this.addLinkListeners()
    this.addEventListeners()
  };
  createContent(){
    this.content = document.querySelector('.content')
    this.template = this.content.getAttribute('data-template')
  }
  createCanvas(){
    this.canvas = new Canvas({
      template: this.template
    })
  }
  createPages(){
    this.pages = {
      home: new Home(),
      collections: new Collection(),
      detail: new Detail(),
      about: new About()
    }
    this.page = this.pages[this.template]
    this.page.create()
    this.update()


  }

  async onChange({url, push = true}){
    this.canvas.onChangeStart(this.template)
    await this.page.hide()

    const request = await window.fetch(url)
    if (request.status === 200){
      const html = await request.text()
      const div = document.createElement('div')
      // if(push){
      //   window.history.pushState({},'',url)
      // }
      div.innerHTML = html

      const divContent = div.querySelector('.content')
      this.template = divContent.getAttribute('data-template')
      this.navigation.onChange({url:this.template})
      this.content.setAttribute('data-template', this.template)
      this.content.innerHTML = divContent.innerHTML
      this.canvas.onChange(this.template)
      this.page = this.pages[this.template]
      this.page.create()
      this.page.show()
      this.onResize()

      this.addLinkListeners()
    }else{
      console.log("Error")
    }
  }

  addLinkListeners(){
    const links = document.querySelectorAll('a')
    each(links, link =>{
      link.onclick = event =>{
        event.preventDefault()

        const {href} = link
        this.onChange({ url:href})
      }
    })
  }
  //Navigation component functions
  createNavigation(){
    this.navigation = new Navigation({
      template: this.template
    })
  }
  // Preloader Functions
  createPreloader(){
    this.preloader = new Preloader()
    this.preloader.once('completed', this.onPreloaded.bind(this))
  }
  async onPreloaded(){
    this.onResize()
    this.preloader.destroy()
    this.page.show()

  }
  update(){


    if(this.page && this.page.update){
      this.page.update()
    }

    if(this.canvas && this.canvas.update){
      this.canvas.update(this.page.scroll)
    }

    this.frame = window.requestAnimationFrame(this.update.bind(this))
  }

  onResize(){
    if(this.canvas && this.canvas.onResize){
      this.canvas.onResize()
    }
    if(this.page && this.page.onResize){
      this.page.onResize()
    }
  }
  onPopstate(){
    this.onChange({url:window.location.pathname, push:false})
  }

  onTouchDown(event){
    if(this.canvas && this.canvas.onTouchDown){
      this.canvas.onTouchDown(event)
    }
  }

  onTouchMove(event){
    if(this.canvas && this.canvas.onTouchMove){
      this.canvas.onTouchMove(event)
    }
  }

  onTouchUp(event){
    if(this.canvas && this.canvas.onTouchUp){
      this.canvas.onTouchUp(event)
    }
  }
  onWheel(event){
    const normalizedWheel = NormalizeWheel(event)

    if(this.canvas && this.canvas.onWheel){
      this.canvas.onWheel(normalizedWheel)
    }
    if(this.page && this.page.onWheel){
      this.page.onWheel(normalizedWheel)
    }

  }


  addEventListeners(){
    window.addEventListener('mousewheel', this.onWheel.bind(this))

    window.addEventListener('mousedown', this.onTouchDown.bind(this))
    window.addEventListener('mousemove', this.onTouchMove.bind(this))
    window.addEventListener('mouseup', this.onTouchUp.bind(this))

    window.addEventListener('touchstart', this.onTouchDown.bind(this))
    window.addEventListener('touchmove', this.onTouchMove.bind(this))
    window.addEventListener('touchend', this.onTouchUp.bind(this))

    window.addEventListener('popstate', this.onPopstate.bind(this))
    window.addEventListener('resize', this.onResize.bind(this))
  }

}

new App()




