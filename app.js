require('dotenv').config()


const express = require('express')
const errorHandler = require('errorhandler')
const bodyParser = require('body-parser')
const methodOveride = require('method-override')
const logger = require('morgan')

const app = express()
const path = require('path')
const port = 3000

const Prismic = require('prismic-javascript')
const PrismicDOM = require('prismic-dom')


app.use(logger('dev'))
app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended:false}))
app.use(methodOveride())
app.use(errorHandler())

const initApi = req =>{
  return Prismic.getApi(process.env.PRISMIC_ENDPOINT, {
    acessToken: process.env.PRISMIC_CLIENT_ID,
    req
  })
}

const  HandlelinkResolver = doc => {
  if(doc.type === 'product'){
    return `/details/${doc.slug}`
  }
  if(doc.type === 'about'){
    return '/about'
  }
  if(doc.type==='collections'){
    return '/collections'
  }

  return '/'
}




app.use((req, res, next) =>{

  res.locals.Link = HandlelinkResolver
  res.locals.PrismicDOM = PrismicDOM

  next()
})

app.set('views',path.join(__dirname, 'views'))
app.set('view engine','pug')

const handeRequest = async api =>{
  const meta = await api.getSingle('meta')
  const preloader = await api.getSingle('preloader')
  const navigation = await api.getSingle('navigatio')
  return {
    meta,
    preloader,
    navigation
  }
}

app.get('/',async(req,res)=>{
  const api = await initApi(req)
  const home = await api.getSingle('home')
  const defaults = await handeRequest(api)
  const { results: collections } = await api.query(Prismic.Predicates.at('document.type','collection'),{
    fetchLinks: 'product.image'
  })
  res.render('pages/home',{
    ...defaults,
    home,
    collections,

  })
})

app.get('/about',async (req,res)=>{
  const api = await initApi(req)
  const defaults = await handeRequest(api)
  const about = await api.getSingle('about')
  defaults.navigation.data.list.forEach(item  =>{
    console.log(item)
  })
  res.render('pages/about',{
    ...defaults,
    about,
  })
})


app.get('/details/:uid',async (req,res)=>{
  const api = await initApi(req)
  const defaults = await handeRequest(api)

  const product = await api.getByUID('product',req.params.uid,{
    fetchLinks: 'collection.title'
  })


  res.render('pages/detail',{
    ...defaults,
    product,

  })
})

app.get('/collections',async(req,res)=>{
  const api = await initApi(req)
  const defaults = await handeRequest(api)

  const home = await api.getSingle('home')


  const { results: collections } = await api.query(Prismic.Predicates.at('document.type','collection'),{
    fetchLinks: 'product.image'
  })

  res.render('pages/collections',{
    ...defaults,
    collections,
    home,

  })
})

app.listen(port, ()=>{
  console.log(`listening at http://localhost:${port}`)
})
