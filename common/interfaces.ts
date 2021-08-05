export type HTTPMethods = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE'

export interface IBCMeta {
	pagination: {
		total: number, // Total number of items in the result set.
		count: number, // Total number of items in the collection response.
		per_page: number, // The amount of items returned in the collection per page, controlled by the limit parameter.
		current_page: number, // The page you are currently on within the collection.
		total_pages: number, // The total number of pages in the collection.
		links: {
			previous: string, // Link to the previous page returned in the response.
			current: string, // Link to the current page returned in the response.
			next: string, // Link to the next page returned in the response.
		},
	},
}
