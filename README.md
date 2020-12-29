# bc-client
Simple API client for the BigCommerce Management API

## Usage

`npm i bc-client`

```javascript
const client = require('bc-client')
const bc = new client('storeHash', 'authToken')

;(async _=>{
    const customers = await bc.get('v3/customers')
    console.log('customers:', customers, '\n')
  
    const physicalProducts = await bc.get('v3/catalog/products', {type:'physical'})
    console.log('physicalProducts', physicalProducts, '\n')

    try {
        let newProduct = await bc.post('v3/catalog/products', {name:'New Thinasdfg', type:'physical', weight:1, price:99.99})
        
        console.log('newProduct', newProduct, '\n')

        let updatedProduct = await bc.put(`v3/catalog/products/${newProduct.id}`, {price:109.99})

        console.log('updatedProduct', updatedProduct, '\n')
    }
    catch(e) { console.log(e.message) }

})();

```
