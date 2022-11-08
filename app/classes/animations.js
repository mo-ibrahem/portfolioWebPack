import Component from 'classes/component'
export default class Animation extends Component {
  constructor({element, elements}){
    super({
      element,
      elements
    })
    this.createObserver()
    this.animateOut()
  }
  createObserver(){
    this.observer = new window.IntersectionObserver( entries =>{
      console.log('This is our entriess',entries)
      entries.forEach(entry =>{
        console.log('this is our entryy',entry)
        if(entry.isIntersecting){
          this.animateIn()
        }
        else{
          this.animateOut()
        }
      })
    })
    this.observer.observe(this.element)
  }

  animateIn(){

  }

  animateOut(){

  }

}