const axios = require('axios').default
const axiosConfig = (query) => {
    return {
        method: 'get',
        url: `https://api.unsplash.com/search/photos?query=${query}&per_page=30&page=1`,
        headers: {
            'Authorization': 'Client-ID QmOcgkOnjiOK3jwyuiPOk3BA8rIVDtnskS73GnXJRK8',
            'Cookie': 'ugid=98ffbccdf78370197a591a0e5115b0b35547002'
        }
    }
}
const fs = require('fs')
const carsModels = JSON.parse(fs.readFileSync('./carsModels.json'))
let result = []
const request = (query) => 
    new Promise(resolve => 
        setTimeout(async () => {
            const response = await axios.get(
                `https://api.unsplash.com/search/photos?query=${query + ' car'}&per_page=30&page=1`,
                {
                    headers: {
                    'Authorization': 'Client-ID QmOcgkOnjiOK3jwyuiPOk3BA8rIVDtnskS73GnXJRK8',
                    'Cookie': 'ugid=98ffbccdf78370197a591a0e5115b0b35547002'
                    }
                }).catch(err => console.log(err))
            resolve(response.data.results)
        }, 1000)
    ) 

const generate = async () => {
    for(const element of carsModels){
        result.push({
            brand: element.brand,
            photos: await request(element.brand)
        })
    }
    fs.writeFileSync('./photos/carsPhotos.json', JSON.stringify(result, null, '\t'))
    process.exit()
}
generate()
// setInterval(function () {
//     if(i===carsModels.length) {
//         clearInterval(this)
//         return
//     }
//     axios(axiosConfig(carsModels[i].brand)).then(res => {
//         result.push({
//             brand: carsModels[i].brand,
//             photos: res.data
//         })
//         fs.writeFile('./photos/carsPhotos.json', JSON.stringify(result, null, '\t'), () => {})
//     }).catch(err => {
//         clearInterval(this)
//         console.log(err)
//     })
//     console.log(carsModels[i].brand)
//     i++
// },1000)
