const fs = require('fs')
const amount = 150
const wheelsPhotosAllData = JSON.parse(fs.readFileSync('./photos/wheelsPhotos.json'))
const wheelsPhotosLinks = []
wheelsPhotosAllData.results.forEach(el => {
  wheelsPhotosLinks.push(el.urls.regular)
})
const caliperPhotosAllData = JSON.parse(fs.readFileSync('./photos/caliperPhotos.json'))
const caliperPhotosLinks = []
caliperPhotosAllData.results.forEach(el => {
  caliperPhotosLinks.push(el.urls.regular)
})
const bodyKitPhotosAllData = JSON.parse(fs.readFileSync('./photos/bodyKitPhotos.json'))
const bodyKitPhotosLinks = []
bodyKitPhotosAllData.results.forEach(el => {
  bodyKitPhotosLinks.push(el.urls.regular)
})
const consumablePhotosAllData = JSON.parse(fs.readFileSync('./photos/consumablesPhotos.json'))
const consumablePhotosLinks = []
consumablePhotosAllData.results.forEach(el => {
  consumablePhotosLinks.push(el.urls.regular)
})
const carsModels = JSON.parse(fs.readFileSync('./carsModels.json'))
const colors = JSON.parse(fs.readFileSync('./colorsRaw.json'))
colors.forEach(el => {
  delete el.rgb
  delete el.families
})
const randomIntFromInterval = (min, max) => { // min and max included 
    return Math.floor(Math.random() * (max - min + 1) + min)
  }

//wheels
const wheels = []
const seasons=['all','winter suitable']
const wheel_design = ['10-SPOKE','5-SPOKE','7-SPOKE','CROSS-SPOKE','DISC-WHEEL','DOUBLE-SPOKE','MULTI-SPOKE','Y-SPOKE']
const wheel_width = ['6.00 J','6.50 J', '7.00 J', '7.50 J', '8.00 J', '8.50 J']
for(let i = 0; i < amount; i++){
  wheels.push({
      brand: carsModels[randomIntFromInterval(0,carsModels.length - 1)].brand,
      season: seasons[randomIntFromInterval(0,seasons.length -1 )],
      diameter: randomIntFromInterval(16, 24),
      color: colors[randomIntFromInterval(0, colors.length - 1)],
      design: wheel_design[randomIntFromInterval(0, wheel_design.length - 1)],
      price: randomIntFromInterval(400,2000),
      width: wheel_width[randomIntFromInterval(0, wheel_width.length - 1)],
      image: wheelsPhotosLinks[randomIntFromInterval(0, wheelsPhotosLinks.length - 1)],
      stock: randomIntFromInterval(0,99)
  })
}
//bodykit
const bodyKit = []
const bodykit_types = [
  'Stainless Steel Add Ons',
  'Front Bumper',
  'Side Skirts',
  'Rear Bumper',
  'Rear Lip',
  'Rear Add On',
  'Hoods',
  'Hood Scoops',
  'Fenders',
  'Fender Flares',
  'Trunk Hatch',
  'Wings and Spoilers',
  'Vertical Lambo Door Kits',
  'OEM Doors',
  'Doors',
  'Grilles',
  'Mirrors'
]
for(let i = 0; i < amount; i++){
  const randomBrandIndex = randomIntFromInterval(0,carsModels.length - 1)
  const randomModelIndex = randomIntFromInterval(0, carsModels[randomBrandIndex].models.length - 1)
  bodyKit.push({
      brand: carsModels[randomBrandIndex].brand,
      type: bodykit_types[randomIntFromInterval(0, bodykit_types.length - 1)],
      car_model: carsModels[randomBrandIndex].models[randomModelIndex],
      color: colors[randomIntFromInterval(0, colors.length - 1)],
      price: randomIntFromInterval(400,36000),
      image: bodyKitPhotosLinks[randomIntFromInterval(0, bodyKitPhotosLinks.length - 1)],
      stock: randomIntFromInterval(0,99)
  })
}
//consumable
// 5 categories
const consumable = []
const consumable_type = ['Oil','Tires','Interior Carpet', 'Windshield Blades', 'Air Filters']
for(let i = 0; i < amount; i++){
  const randomBrandIndex = randomIntFromInterval(0,carsModels.length - 1)
  const randomModelIndex = randomIntFromInterval(0, carsModels[randomBrandIndex].models.length - 1)
  const object = {
    brand: carsModels[randomBrandIndex].brand,
    type: consumable_type[randomIntFromInterval(0, consumable_type.length - 1)],
    car_model: carsModels[randomBrandIndex].models[randomModelIndex],
    price: randomIntFromInterval(400,3600),
    image: consumablePhotosLinks[randomIntFromInterval(0, consumablePhotosLinks.length - 1)],
    stock: randomIntFromInterval(0,99)
  }
  if (object.type === consumable_type[2]) object.color = colors[randomIntFromInterval(0, colors.length - 1)]
  if (object.type === consumable_type[1]) {
    object.width = randomIntFromInterval(180,210)
    object.height = randomIntFromInterval(40,80)
    object.diameter = randomIntFromInterval(15,19)
  }
  consumable.push(object)
}
//calipers
const calipers = []
const calipers_positions = ['Front Axle', 'Rear Axle', 'behind the axle', 'in front of axle', 'Rear Axle Right', 'Rear Axle Left']
const caliper_types = [
  'Fist-type Caliper',
  'Brake Caliper with integrated parking brake',
  'Brake caliper with adjusting element for electr. handbrake',
  'Brake Caliper (2 pistons)',
  'Fixed Caliper (2 pistons)',
  'Brake Caliper (1 piston)'
]
const caliper_diameters = [60,38,54,41,42,57]
for(let i = 0; i < amount; i++){
  calipers.push({
      brand: carsModels[randomIntFromInterval(0,carsModels.length - 1)].brand,
      position: calipers_positions[randomIntFromInterval(0, calipers_positions.length - 1)],
      type: caliper_types[randomIntFromInterval(0, caliper_types.length - 1)],
      diameter: caliper_diameters[randomIntFromInterval(0, caliper_diameters.length - 1)],
      color: colors[randomIntFromInterval(0, colors.length - 1)],
      price: randomIntFromInterval(200,3500),
      image: caliperPhotosLinks[randomIntFromInterval(0, wheelsPhotosLinks.length - 1)],
      stock: randomIntFromInterval(0,99)
  })
}
const result = [{
  brands: carsModels,
  wheels: wheels,
  bodyKit: bodyKit,
  consumable: consumable,
  calipers: calipers
}]
fs.writeFileSync('./result.json', JSON.stringify(result, null, '\t'))