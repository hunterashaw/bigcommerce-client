const fetch = require('node-fetch')
const querystring = require('querystring')

module.exports = class {
    /**
     * Construct BigCommerceClient Instance.
     * @param {string} hash Store Hash (ex: gha3w9n1at)
     * @param {string} token API Token (ex: j3aovsvag3vg88hhyl4qt89q6ag2b6b)
     * @param {boolean} debug Enable console output for every request
     */
    constructor(hash, token, debug=false){
        this.base = `https://api.bigcommerce.com/stores/${hash}/`
        this.headers = {
            'X-Auth-Token':token,
            'Accept':'application/json',
            'Content-Type':'application/json'
        }
        this.meta = {}
        this.debug = debug
    }

    /**
     * Performs a GET request to the BigCommerce Management API at the specified endpoint. Throws error w/ http status information if non-200 response is returned.
     * @async
     * @returns {object} JSON data returned from a 2-- request
     * @param {string} endpoint Url endpoint from version onward (example: 'v3/catalog/products')
     * @param {object} queries Object w/ keys & string values of each url query parameter (example: {sku:'10205'})
     */
    async get(endpoint, queries={}){
        endpoint += '?' + querystring.stringify(queries)
        let response
        try {
            if (this.debug) console.log('GET', this.base + endpoint)
            response = await fetch(this.base + endpoint, {headers:this.headers, timeout:15000})
        } catch(e){return await this.get(endpoint, queries)}
        if (response.ok) return await this.readResponse(response)
        throw new Error(`${response.status} - ${response.statusText}: ${await response.text()}`)
    }

    /**
     * Function to perform on each page returned by endpoint. Should accept an array of objects from page.
     * @callback eachPage
     * @param {object[]} pageContents
     */

    /**
     * Performs sequential GET requests to the BigCommerce Management API at the specified endpoint. For each page in query it will perform the provided callback, passing an array of objects in page.
     * @async
     * @returns {null}
     * @param {string} endoint Url endpoint from version onward (example: 'v3/catalog/products')
     * @param {eachPage} eachPage Callback for each page provided by endpoint
     * @param {object} queries Object w/ keys & string values of each url query parameter (example: {sku:'10205'}). Page & limit can be passed to control start & page size.
     */
     async paginate(endpoint, eachPage, queries={}){
        const page = await this.get(endpoint, queries)
        const current = this.meta.pagination.current_page
        let total = this.meta.pagination.total_pages
        await eachPage(page)

        if (this.debug) console.log('CURRENT PAGE:', current, 'TOTAL PAGES:', total)
        if (current === total) return
        for (let current_page = current + 1; current_page <= total; current_page++){
            queries.page = current_page
            await eachPage(await this.get(endpoint, queries))
            if (this.debug) console.log('CURRENT PAGE:', current_page, 'TOTAL PAGES:', total)
        }
    }

    /**
     * Performs sequential GET request to the BigCommerce Management API at the specified endpoint. Concatenates results from all pages.
     * @async
     * @returns {object[]} Concatenated JSON data returned from a 2-- request
     * @param {string} endpoint Url endpoint from version onward (example: 'v3/catalog/products')
     * @param {object} queries Object w/ keys & string values of each url query parameter (example: {sku:'10205'})
     */
    async getAll(endpoint, queries={}){
        let result = []
        await this.paginate(endpoint, (items)=>{
            result = result.concat(items)
        }, queries)
        return result
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
            if (this.debug) console.log('POST', this.base + endpoint)
            response = await fetch(this.base + endpoint, {method:'post', headers:this.headers, timeout:15000, body:JSON.stringify(body)})
        } catch (e) {return await this.post(endpoint, body)}
        if (response.ok) return await this.readResponse(response)
        throw new Error(`${response.status} - ${response.statusText}: ${await response.text()}`)
    }

    /**
     * Performs a PUT request to the BigCommerce Management API at the specified endpoint. Throws error w/ http status information if non-200 response is returned.
     * @async
     * @returns {object} JSON data returned from a 2-- request
     * @param {string} endpoint Url endpoint from version onward (example: 'v3/catalog/products')
     * @param {object} body Request body to be serialized and sent to endpoint
     */
    async put(endpoint, body){
        let response
        try {
            if (this.debug) console.log('PUT', this.base + endpoint)
            response = await fetch(this.base + endpoint, {method:'put', headers:this.headers, timeout:15000, body:JSON.stringify(body)})
        } catch (e) {return await this.put(endpoint, body)}
        if (response.ok) return await this.readResponse(response)
        throw new Error(`${response.status} - ${response.statusText}: ${await response.text()}`)
    }

    /**
     * Performs a DELETE request to the BigCommerce Management API at the specified endpoint. Throws error w/ http status information if non-200 response is returned.
     * @async
     * @param {string} endpoint Url endpoint from version onward (example: 'v3/catalog/products')
     * @param {object} queries Object w/ keys & string values of each url query parameter (example: {sku:'10205'})
     */
    async delete(endpoint, queries={}){
        endpoint += '?' + querystring.stringify(queries)
        let response
        try {
            if (this.debug) console.log('DELETE', this.base + endpoint)
            response = await fetch(this.base + endpoint, {method:'delete', headers:this.headers, timeout:15000})
        } catch(e){await this.delete(endpoint, queries)}
        if (response.ok) return
        throw new Error(`${response.status} - ${response.statusText}: ${await response.text()}`)
    }

    /**
     * Performs sequential DELETE requests to the BigCommerce Management API at the specified endpoint. Will perform a getAll request, then for each ID returned, it will perform a DELETE.
     * @async
     * @param {string} endpoint Url endpoint from version onward (example: 'v3/catalog/products')
     * @param {object} queries Object w/ keys & string values of each url query parameter (example: {sku:'10205'}). This function overwrites the limit propery to 3 to achieve high request concurrency
     */
    async deleteAll(endpoint, queries={}){
        queries.limit = 3
        let items = await this.get(endpoint, queries)
        while (items.length){
            console.log('Im about to delete this stuff', items.map((item)=>item.name))
            await Promise.all([
                items[0] !== undefined ? this.delete(endpoint + '/' + items[0].id) : undefined,
                items[1] !== undefined ? this.delete(endpoint + '/' + items[1].id) : undefined,
                items[2] !== undefined ? this.delete(endpoint + '/' + items[2].id) : undefined
            ])
            items = await this.get(endpoint, queries)
        }
    }

    async readResponse(response){
        const result = await response.text()
        if (result.length){
            const body = JSON.parse(result)
            this.meta = body.meta
            return body.data
        } else return undefined
    }
}