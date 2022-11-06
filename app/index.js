import 'pages/about'
import 'pages/detail'
import 'pages/collections'
import 'pages/home'
class App{
  constructor(){
    console.log('app constructor call')
  }
  createPages(){
    this.pages = {
      home: new Home(),
      collection: new Collection(),
      detail: new Detail(),
      about: new About()
    }
  }
}

new App()




