const axios = require('axios').default
// const axiosConfig = (query) => {
//     return {
//         method: 'get',
//         url: `https://api.unsplash.com/search/photos?query=${query}&per_page=30&page=1`,
//         headers: {
//             'Authorization': 'Client-ID QmOcgkOnjiOK3jwyuiPOk3BA8rIVDtnskS73GnXJRK8',
//             'Cookie': 'ugid=98ffbccdf78370197a591a0e5115b0b35547002'
//         }
//     }
// }
const fs = require('fs')
const trending = JSON.parse(fs.readFileSync('./trending_forever.json'))
let books = []
let authors = []
let subjects = []
let events = []
const randomIntFromInterval = (min, max) => { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}
const { MongoClient } = require('mongodb')
const url = 'mongodb://localhost:3002/JavaLibrary'
const client = new MongoClient(url)
const dbName = 'JavaLibrary'

const getPhotos = async (query) => {
  const response = await axios.get(
    `https://api.unsplash.com/search/photos?query=${query}&per_page=30&page=1`,
    {
      headers: {
        'Authorization': 'Client-ID QmOcgkOnjiOK3jwyuiPOk3BA8rIVDtnskS73GnXJRK8',
        'Cookie': 'ugid=98ffbccdf78370197a591a0e5115b0b35547002'
      }
    }).catch(err => console.log(err))
  return response.data.results
}
const request = (url) =>
  new Promise(resolve =>
    setTimeout(async () => {
      const bookData = await axios.get(
        `https://openlibrary.org${url}.json`,
        {
          // headers: {
          //   'Authorization': 'Client-ID QmOcgkOnjiOK3jwyuiPOk3BA8rIVDtnskS73GnXJRK8',
          //   'Cookie': 'ugid=98ffbccdf78370197a591a0e5115b0b35547002'
          // }
        }).catch(err => console.log(err))

      resolve(bookData.data)
    }, 1000)
  )
const generate = async () => {
  const bookPhotos = await getPhotos('book')
  //sleep 1 sec
  await new Promise(resolve => setTimeout(resolve, 1000))
  const authorPhotos = await getPhotos('profile picture')
  //sleep 1 sec
  await new Promise(resolve => setTimeout(resolve, 1000))
  const subjectPhotos = await getPhotos('state of mind')
  for (const [i, item] of trending.entries()) {
    let data = await request(item.key)
    console.log(i)
    console.log(data)
    let subject = ''
    let links = []
    if (data.subjects !== undefined) subject = data.subjects[0]
    if (data.links !== undefined) links = [...data.links]
    books.push({
      type: item.key.slice(1,6),
      key: item.key.slice(7, item.key.length),
      title: item.title + ' (' + item.first_publish_year +')',
      first_publish_year: item.first_publish_year,
      author_key: item.author_key[0],
      author_name: item.author_name[0],
      description: data.description,
      subject: subject,
      links: links,
      comments: [],
      rate: randomIntFromInterval(30, 50) / 10,
      image: bookPhotos[randomIntFromInterval(0, bookPhotos.length - 1)].urls.regular
    })
    authors.push({
      author_key: item.author_key[0],
      author_name: item.author_name[0],
      rate: randomIntFromInterval(30, 48) / 10,
      image: authorPhotos[randomIntFromInterval(0, authorPhotos.length - 1)].urls.regular
    })
    if (data.subjects !== undefined) {
      data.subjects.forEach(s => {
        subjects.push({
          subject: s,
          rate: randomIntFromInterval(0, 49) / 10,
          image: subjectPhotos[randomIntFromInterval(0, subjectPhotos.length - 1)].urls.regular
        })
      })
    }
  }
  const files = fs.readdirSync('./scary')
  for (const file of files){
    let text = fs.readFileSync(`./scary/${file}`).toLocaleString()
    events.push({
      event: 'Halloween',
      title: file,
      data: text
    })
  }
  fs.writeFileSync('./books.json', JSON.stringify(books, null, '\t'))
  fs.writeFileSync('./subjects.json', JSON.stringify(subjects, null, '\t'))
  fs.writeFileSync('./events.json', JSON.stringify(events, null, '\t'))
  createDB()
}
const createDB = async () => {
  await client.connect()
  const db = client.db(dbName)
  const usersColl = db.collection('Users')
  usersColl.deleteMany()
  await usersColl.createIndex({ email: 1 }, { unique: true })

  const booksColl = db.collection('books')
  booksColl.deleteMany()
  await booksColl.createIndex({ title: 1 })
  await booksColl.createIndex({ first_publish_year: 1 })
  await booksColl.createIndex({ author_name: 1 })
  await booksColl.createIndex({ subject: 1 })
  await booksColl.insertMany(books)

  const collOfBooks = db.collection('bookcollections')
  collOfBooks.deleteMany()
  await collOfBooks.createIndex({ email: 1 })
  await collOfBooks.createIndex({ name: 1 })

  const eventsColl = db.collection('events')
  await eventsColl.createIndex({ event: 1 })
  eventsColl.deleteMany()
  await eventsColl.insertMany(events)

  const authorsColl = db.collection('authors')
  authorsColl.deleteMany()
  await authorsColl.createIndex({ author_key: 1 },{unique:true})
  await authorsColl.insertMany(authors, { ordered: false })

  const subjectsColl = db.collection('subjects')
  subjectsColl.deleteMany()
  await subjectsColl.createIndex({ subject: 1 }, { unique: true })
  await subjectsColl.insertMany(subjects,{ordered: false})
}
const pushOneFromJSON = async () => {
  const data = JSON.parse(fs.readFileSync('./subjects.json'))
  await client.connect()
  const db = client.db(dbName)
  const subjectsColl = db.collection('subjects')
  subjectsColl.deleteMany()
  await subjectsColl.createIndex({ subject: 1 }, { unique: true })
  await subjectsColl.insertMany(data,{ordered: false})
}
generate()
// pushOneFromJSON()