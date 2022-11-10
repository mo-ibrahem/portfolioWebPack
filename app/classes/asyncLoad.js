import Component from 'classes/component'
export default class AsyncLoad extends Component{
  constructor({element}){
    super({
      element
    })
    this.createObserver()
  }
  createObserver(){
    this.observer = new window.IntersectionObserver( entries =>{
      entries.forEach(entry =>{
        if(entry.isIntersecting){

          this.element.src = this.element.getAttribute('data-src')
          this.element.onload = _ =>{
            this.element.classList.add('loaded')
          }
        }
      })
    })
    this.observer.observe(this.element)
  }
}