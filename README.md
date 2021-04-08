# bigcommerce-client
Simple API client for the BigCommerce Management API

## Installation

`npm i bigcommerce-client`

## Usage

```javascript
const bc_client = require('bigcommerce-client')
const store = new client('storeHash', 'authToken')
```

### Get a Resource

```javascript
async function getFromSKU(sku){
    return await store.get('v3/catalog/products', {sku})
}
```

### Get All Resources

```javascript
async function getOutOfStock(sku){
    return await store.getAll('v3/catalog/products', {inventory_level:0})
}
```

### Paginate All Resources

```javascript
async function updateOutOfStock(sku){
    await store.paginate('v3/catalog/products', (products)=>{
        await store.put('v3/catalog/products', products.map((product)=>{
            product.inventory_level = 1
            return product
        }))
    }, {limit:10, inventory_level:0, include_fields:'inventory_level'})
}
```

### Create a Resource

```javascript
async function createDigitalProduct(name, price){
    return (await store.post('v3/catalog/products', {name, price, type:'digital', weight:0})).id
}
```

### Update Resource

```javascript
async function changePrice(id, price){
    try {
        await store.put(`v3/catalog/products/${id}`, {price}))
    } catch (new Error('ID not found'))
}
```

### Delete a Resource

```javascript
async function deleteProduct(id){
    try {
        await store.delete(`v3/catalog/products/${id}`))
    } catch (new Error('ID not found'))
}
```

### Delete All Resources

```javascript
async function deleteAllProducts(){
    await store.deleteAll(`v3/catalog/products`))
}
```