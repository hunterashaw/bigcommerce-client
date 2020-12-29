const fetch = require('node-fetch')
const querystring = require('querystring')

// TODO Implement Rate & Concurrency Limiting

// TODO Implement Helper Class w/ Named Endpoint Methods

module.exports = class {
    /**
     * Construct BigCommerceClient Instance.
     * @param {string} hash Store Hash (ex: gha3w9n1at)
     * @param {string} token API Token (ex: j3aovsvag3vg88hhyl4qt89q6ag2b6b)
     */
    constructor(hash, token){
        this.base = `https://api.bigcommerce.com/stores/${hash}/`
        this.headers = {
            'X-Auth-Token':token,
            'Accept':'application/json',
            'Content-Type':'application/json'
        }
    }

    /**
     * Builds a safe url from a query object.
     * @param {object} queries Object w/ keys & string values of each url query parameter (example: {sku:'10205'})
     */
    buildQueries(queries){
        let result = []
        for (let query in queries) { if (queries[query] !== undefined) result.push(querystring.escape(query) + '=' + querystring.escape(queries[query])) }
        return '?' + result.join('&')
    }

    /**
     * Performs a GET request to the BigCommerce Management API at the specified endpoint. Throws error w/ http status information if non-200 response is returned.
     * @async
     * @returns {object} JSON data returned from a 2-- request
     * @param {string} endpoint Url endpoint from version onward (example: 'v3/catalog/products')
     * @param {object} queries Object w/ keys & string values of each url query parameter (example: {sku:'10205'})
     */
    async get(endpoint, queries=null){
        if (queries !== null) endpoint += this.buildQueries(queries)
        let response
        try {
            response = await fetch(this.base + endpoint, {headers:this.headers, timeout:15000})
        } catch(e){return await this.get(endpoint, queries)}
        if (response.ok) return (await response.json()).data
        throw new Error(`${response.status} - ${response.statusText}: ${await response.text()}`)
    }

    /**
     * Performs a POST request to the BigCommerce Management API at the specified endpoint. Throws error w/ http status information if non-200 response is returned.
     * @async
     * @returns {object} JSON data returned from a 2-- request
     * @param {string} endpoint Url endpoint from version onward (example: 'v3/catalog/products')
     * @param {object} body Request body to be serialized and sent to endpoint
     */
    async post(endpoint, body){
        let response
        try {
            response = await fetch(this.base + endpoint, {method:'post', headers:this.headers, timeout:15000, body:JSON.stringify(body)})
        } catch (e) {return await this.post(endpoint, body)}

        if (response.ok) return (await response.json()).data
        throw new Error(`${response.status} - ${response.statusText}: ${await response.text()}`)
    }

    /**
     * Performs a PUT request to the BigCommerce Management API at the specified endpoint. Throws error w/ http status information if non-200 response is returned.
     * @async
     * @returns {object} JSON data returned from a 2-- request
     * @param {string} endpoint Url endpoint from version onward (example: 'v3/catalog/products')
     * @param {object} queries Object w/ keys & string values of each url query parameter (example: {sku:'10205'})
     */
    async put(endpoint, body){
        let response
        try {
            response = await fetch(this.base + endpoint, {method:'put', headers:this.headers, timeout:15000, body:JSON.stringify(body)})
        } catch (e) {return await this.put(endpoint, body)}
        if (response.ok) return (await response.json()).data
        throw new Error(`${response.status} - ${response.statusText}: ${await response.text()}`)
    }
}