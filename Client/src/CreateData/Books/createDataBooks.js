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
const randomIntFromInterval = (min, max) => { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}
const { MongoClient } = require('mongodb')
const url = 'mongodb://localhost:3002/JavaLibrary'
const client = new MongoClient(url)
const dbName = 'JavaLibrary'

const request = (url) =>
  new Promise(resolve =>
    setTimeout(async () => {
      const response = await axios.get(
        `https://openlibrary.org${url}.json`,
        {
          // headers: {
          //   'Authorization': 'Client-ID QmOcgkOnjiOK3jwyuiPOk3BA8rIVDtnskS73GnXJRK8',
          //   'Cookie': 'ugid=98ffbccdf78370197a591a0e5115b0b35547002'
          // }
        }).catch(err => console.log(err))
      resolve(response.data)
    }, 1000)
  )
const generate = async () => {
  for (const [i,item] of trending.entries()) {
    let data = await request(item.key)
    console.log(i)
    console.log(data)
    let subject = ''
    if (data.subjects !== undefined) subject = data.subjects[0]
    books.push({
      key: item.key,
      title: item.title,
      first_publish_year: item.first_publish_year,
      author_key: item.author_key[0],
      author_name: item.author_name[0],
      description: data.description,
      subject: subject,
      links: data.links,
      rate: randomIntFromInterval(0,50)/10
    })
    authors.push({
      author_key: item.author_key[0],
      author_name: item.author_name[0],
    })
    if (data.subjects !== undefined){
      data.subjects.forEach(s => {
        subjects.push({
          subject: s
        })
      })
    }
  }
  fs.writeFileSync('./books.json', JSON.stringify(books, null, '\t'))
  createDB()
}
generate()
const createDB = async () => {
  await client.connect()
  const db = client.db(dbName)
  const usersColl = db.collection('Users')
  await usersColl.createIndex({email:1},{unique:true})
  const booksColl = db.collection('Books')
  await booksColl.createIndex({title:1})
  await booksColl.createIndex({first_publish_year:1})
  await booksColl.createIndex({author_name:1})
  await booksColl.createIndex({subject:1})
  await booksColl.insertMany(books)
  const collOfBooks = db.collection('BookCollections')
  await collOfBooks.createIndex({email:1})
  await collOfBooks.createIndex({name:1})
  const authorsColl = db.collection('Authors')
  await authorsColl.createIndex({author_key:1})
  await authorsColl.insertMany(authors)
  const subjectsColl = db.collection('Subjects')
  await subjectsColl.createIndex({subject:1}, {unique:true})
  await subjectsColl.insertMany(subjects, {ordered: false})
}