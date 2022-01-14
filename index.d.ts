import { ParsedUrlQueryInput } from "querystring";

export default class BigCommerceClient {
    base: string
    headers: {
        "X-Auth-Token": string
        Accept: "application/json"
        "Content-Type": "application/json"
    }
    meta: object
    debug: boolean
    status?: number
    maxAttempts: number
    timeout: number

    /**
     * Construct BigCommerceClient Instance.
     * @param {string} hash Store Hash (ex: gha3w9n1at)
     * @param {string} token API Token (ex: j3aovsvag3vg88hhyl4qt89q6ag2b6b)
     * @param {boolean} debug Enable console output for every request
     * @param {number} timeout Max time in millis for timeout (default: 15000)
     * @param {number} maxAttempts Number of retry attempts on timeout (default: 3)
     */
    constructor(
        hash: string,
        token: string,
        debug?: boolean,
        timeout?: number,
        maxAttempts?: number
    )

    /**
     * Performs a GET request to the BigCommerce Management API at the specified endpoint. Throws error w/ http status information if non-200 response is returned.
     * @returns {object} JSON data returned from a 2-- request
     * @param {string} endpoint Url endpoint from version onward (example: 'v3/catalog/products')
     * @param {object} queries Object w/ keys & string values of each url query parameter (example: {sku:'10205'})
     */
    get(endpoint: string, queries?: object): any

    /**
     * Function to perform on each page returned by endpoint. Should accept an array of objects from page.
     * @callback eachPage
     * @param {object[]} pageContents
     */

    /**
     * Performs sequential GET requests to the BigCommerce Management API at the specified endpoint. For each page in query it will perform the provided callback, passing an array of objects in page.
     * @generator
     * @param {string} endpoint Url endpoint from version onward (example: 'v3/catalog/products')
     * @param {object} queries Object w/ keys & string values of each url query parameter (example: {sku:'10205'}). Page & limit can be passed to control start & page size.
     * @param {number} concurrency Amount of concurrent requests to make
     * @yields {Promise<[Array, number, number]>}
     */
    paginate<T>(
        endpoint: string,
        queries?: object,
        concurrency?: number
    ): AsyncGenerator<[Array<T>, number, number], never, void>

    /**
     * Performs sequential GET request to the BigCommerce Management API at the specified endpoint. Concatenates result from all pages.
     * @async
     * @returns {object[]} Concatenated JSON data returned from a 2-- request
     * @param {string} endpoint Url endpoint from version onward (example: 'v3/catalog/products')
     * @param {object} queries Object w/ keys & string values of each url query parameter (example: {sku:'10205'})
     */
    getAll(endpoint: string, queries?: ParsedUrlQueryInput): Promise<object[]>

    /**
     * Performs a POST request to the BigCommerce Management API at the specified endpoint. Throws error w/ http status information if non-200 response is returned.
     * @returns {object} JSON data returned from a 2-- request
     * @param {string} endpoint Url endpoint from version onward (example: 'v3/catalog/products')
     * @param {object} body Request body to be serialized and sent to endpoint
     */
    post(endpoint: string, body?: object): Promise<object>

    /**
     * Performs a PUT request to the BigCommerce Management API at the specified endpoint. Throws error w/ http status information if non-200 response is returned.
     * @returns {object} JSON data returned from a 2-- request
     * @param {string} endpoint Url endpoint from version onward (example: 'v3/catalog/products')
     * @param {object} body Request body to be serialized and sent to endpoint
     */
    put(endpoint: string, body: object): Promise<object>

    /**
     * Performs a DELETE request to the BigCommerce Management API at the specified endpoint. Throws error w/ http status information if non-200 response is returned.
     * @param {string} endpoint Url endpoint from version onward (example: 'v3/catalog/products')
     * @param {object} queries Object w/ keys & string values of each url query parameter (example: {sku:'10205'})
     */
    delete(endpoint: string, queries?: object): Promise<void>

    /**
     * Performs sequential DELETE requests to the BigCommerce Management API at the specified endpoint. Will perform a getAll request, then for each ID returned, it will perform a DELETE.
     * @async
     * @param {string} endpoint Url endpoint from version onward (example: 'v3/catalog/products')
     * @param {object} queries Object w/ keys & string values of each url query parameter (example: {sku:'10205'}).
     * @param {number} limit Amount of concurrent delete requests that will be performed. If the default setting of 3 errors out, set it to 1.
     */
    deleteAll(endpoint: string, queries?: object, limit?: number): Promise<void>

    readResponse(url: string, method?: string, body?: any, attempts?: number): Promise<object>
}
