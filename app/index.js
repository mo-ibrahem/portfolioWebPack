import each from 'lodash/each'
import Preloader from 'components/preloader'

import About from 'pages/about'
import Detail from 'pages/detail'
import Collection from 'pages/collections'
import Home from 'pages/home'
class App{
  constructor(){
    this.createPreloader()
    this.createContent()
    this.createPages()
    this.addLinkListeners()
    this.addEventListeners()
  };
  createContent(){
    this.content = document.querySelector('.content')
    this.template = this.content.getAttribute('data-template')
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
  async onChange(url){
    await this.page.hide()

    const request = await window.fetch(url)
    if (request.status === 200){
      const html = await request.text()
      const div = document.createElement('div')
      div.innerHTML = html

      const divContent = div.querySelector('.content')
      this.template = divContent.getAttribute('data-template')
      this.content.setAttribute('data-template', this.template)
      this.content.innerHTML = divContent.innerHTML
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
        this.onChange(href)
      }
    })
  }
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
    this.frame = window.requestAnimationFrame(this.update.bind(this))
  }
  onResize(){
    if(this.page && this.page.onResize){
      this.page.onResize()
    }
  }
  addEventListeners(){
    window.addEventListener('resize', this.onResize.bind(this))
  }

}

new App()




