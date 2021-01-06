require('dotenv').config();
const uuid = require('uuid').v4;
const client = require('bc-client')
const bc = new client(process.env.STORE_HASH, process.env.STORE_TOKEN)

const productName = uuid();
let productId;

describe("client", () => {
    test("should return an array from 'GET v3/customers'", async () => {
        const customers = await bc.get('v3/customers');
        return (
            expect(customers).toHaveProperty('length') &&
            expect(customers.length).toBeGreaterThan(0)
        );
    })

    test("should return a product from 'POST v3/catalog/products'", async () => {
        const product = await bc.post(`v3/catalog/products`, {name: productName, type:'physical', weight:1, price:99.99})
        productId = product.id;
        return(
            expect(product).toHaveProperty("name") &&
            expect(product.name).toBe(productName) &&
            expect(product).toHaveProperty("type") &&
            expect(product.name).toBe("physical") &&
            expect(product).toHaveProperty("weight") &&
            expect(product.name).toBe(1) &&
            expect(product).toHaveProperty("price") &&
            expect(product.name).toBe(99.99)
        )
    })

    test("should return an updated product from 'PUT v3/catalog/products'", async () => {
        const product = await await bc.put(`v3/catalog/products/${productId}`, {price:909.99})
        return(
            expect(product).toHaveProperty("name") &&
            expect(product.name).toBe(productName) &&
            expect(product).toHaveProperty("type") &&
            expect(product.name).toBe("physical") &&
            expect(product).toHaveProperty("weight") &&
            expect(product.name).toBe(1) &&
            expect(product).toHaveProperty("price") &&
            expect(product.name).toBe(909.99)
        )
    })
})