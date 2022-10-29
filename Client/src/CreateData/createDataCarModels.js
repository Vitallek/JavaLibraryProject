import axios from 'axios'
import vinGenerator from 'vin-generator'
import {colorsRaw} from './colorsRaw'
const getPhotos = async (query) => {
  return axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/random-photos/${query}`)
    .then(response => {
      console.log(response.data)
      const data = JSON.parse(response.data.data)
      console.log(data)
      let carsModelsPhotosLinks = []
      data.results.forEach(photo => {
        carsModelsPhotosLinks.push(photo.urls.regular)
      })
      return carsModelsPhotosLinks
    })
    .catch(err => console.log(err))
}
const getModels = async () => {
  return axios.get(`http://${process.env.REACT_APP_SERVER_ADDR}/get-all/brands`)
    .then(response => response.data.data)
    .catch(err => console.log(err))
}
const colors = [...colorsRaw]
colors.forEach(el => {
  delete el.rgb
  delete el.families
})
const randomIntFromInterval = (min, max) => { // min and max included 
  return Math.floor(Math.random() * (max - min + 1) + min)
}
const types = [
  'Hatchback',
  'Sedan',
  'MUV/SUV',
  'Coupe',
  'Convertible',
  'Wagon',
  'Van',
  'Jeep'
]
const fuelTypes = ['petrol', 'diesel', 'electric', 'hybrid']
const transmissions = ['auto', 'manual', 'sequential']
const convenience = [
  'Adaptive Cruise Control',
  'Heated Seats',
  'Navigation System',
  'Remote Start'
]
const entertainment = [
  'Apple CarPlay/Android Auto',
  'Bluetooth',
  'HomeLink',
  'Premium Sound System'
]
const exterior = [
  'Alloy Wheels',
  'Sunroof/Moonroof'
]
const safety = [
  'Backup Camera',
  'Brake Assist',
  'Stability Control'
]
const seating = [
  'Leather Seats',
  'Memory Seat',
  'Third Row Seating'
]
export const generateBrandData = async (selectedBrand, amount) => {
  const carsModels = await getModels()
  const carsModelsPhotosLinks = await getPhotos(selectedBrand)
  const resultPerBrand = []
  const brand = carsModels.find(el => el.brand === selectedBrand)
  if(typeof brand === 'undefined') return []
  const brandIndex = carsModels.indexOf(brand)
  
  for (let i = 0; i < amount; i++) {
    const randomModelIndex = randomIntFromInterval(0, carsModels[brandIndex].models.length - 1)
    const year = randomIntFromInterval(2000, new Date().getFullYear())
    let gen = 0
    let price = randomIntFromInterval(400, 10000)
    let miles = randomIntFromInterval(200000, 300000)
    for (let tempYear = 2000; tempYear <= new Date().getFullYear(); tempYear += 4) {
      if (tempYear > year) break;
      gen += 1
      price = randomIntFromInterval(price, price * 2)
      miles = miles - randomIntFromInterval(0, 30000)
      if (miles < 0) miles = 0
    }
    resultPerBrand.push({
      brand: brand.brand,
      model: carsModels[brandIndex].models[randomModelIndex],
      year: year,
      gen: gen,
      color: colors[randomIntFromInterval(0, colors.length - 1)],
      price: price,
      bodyType: types[randomIntFromInterval(0, types.length - 1)],
      mileage: miles,
      fuelType: fuelTypes[randomIntFromInterval(0, fuelTypes.length - 1)],
      VIN: vinGenerator.generateVin(),
      transmission: transmissions[randomIntFromInterval(0, transmissions.length - 1)],
      images: carsModelsPhotosLinks,
      convenience: convenience[randomIntFromInterval(0, convenience.length - 1)],
      entertainment: entertainment[randomIntFromInterval(0, entertainment.length - 1)],
      safety: safety[randomIntFromInterval(0, safety.length - 1)],
      exterior: exterior[randomIntFromInterval(0, exterior.length - 1)],
      seating: seating[randomIntFromInterval(0, seating.length - 1)],
      status: 0
    })
  }
  console.log(resultPerBrand)
  return resultPerBrand
}
// const amount = 30
// let result = []
// carsModels.forEach((brand, brandIndex) => {
//   const resultPerBrand = []
//   for (let i = 0; i < amount; i++) {
//     const randomModelIndex = randomIntFromInterval(0, carsModels[brandIndex].models.length - 1)
//     const brandPhotoObject = carsModelsPhotosLinks.find(el => el.brand === carsModels[brandIndex].brand)
//     if (typeof brandPhotoObject === 'undefined') continue
//     const images = brandPhotoObject.photos
//     const year = randomIntFromInterval(2000, new Date().getFullYear())
//     let gen = 0
//     let price = randomIntFromInterval(400, 10000)
//     let miles = randomIntFromInterval(200000, 300000)
//     for (let tempYear = 2000; tempYear <= new Date().getFullYear(); tempYear += 4) {
//       if (tempYear > year) break;
//       gen += 1
//       price = randomIntFromInterval(price, price * 2)
//       miles = miles - randomIntFromInterval(0, 30000)
//       if (miles < 0) miles = 0
//     }
//     resultPerBrand.push({
//       brand: brand.brand,
//       model: carsModels[brandIndex].models[randomModelIndex],
//       year: year,
//       gen: gen,
//       color: colors[randomIntFromInterval(0, colors.length - 1)],
//       price: price,
//       bodyType: types[randomIntFromInterval(0, types.length - 1)],
//       mileage: miles,
//       fuelType: fuelTypes[randomIntFromInterval(0, fuelTypes.length - 1)],
//       VIN: vinGenerator.generateVin(),
//       transmission: transmissions[randomIntFromInterval(0, transmissions.length - 1)],
//       images: images,
//       convenience: convenience[randomIntFromInterval(0, convenience.length - 1)],
//       entertainment: entertainment[randomIntFromInterval(0, entertainment.length - 1)],
//       safety: safety[randomIntFromInterval(0, safety.length - 1)],
//       exterior: exterior[randomIntFromInterval(0, exterior.length - 1)],
//       seating: seating[randomIntFromInterval(0, seating.length - 1)],
//       status: 0
//     })
//   }
//   result.push({
//     brand: brand.brand,
//     data: resultPerBrand
//   })
// })