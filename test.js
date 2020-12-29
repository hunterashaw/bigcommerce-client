const client = require('./index')
const bc = new client('ghv3w6n1aw', 'j3foqyvkg3vg88uhylwqt8hq3a72b2b')

;(async _=>{
    const customers = await bc.get('v3/customers')
    console.log('customers:', customers, '\n')
  
    const physicalProducts = await bc.get('v3/catalog/products', {type:'physical'})
    console.log('physicalProducts', physicalProducts, '\n')

    try {
        let newProduct = await bc.post('v3/catalog/products', {name:'New Thinasdfg', type:'physical', weight:1, price:99.99})

        let updatedProduct = await bc.put(`v3/catalog/products/${newProduct.id}`, {price:109.99})

        console.log('updatedProduct', updatedProduct, '\n')
    }
    catch(e) { console.log(e.message) }

})();