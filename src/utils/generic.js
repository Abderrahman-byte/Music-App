export const parseQuery = (queryString) => {
    const queryParser = new URLSearchParams(queryString)
    let parsedQuery = {}

    queryParser.forEach((value, key) => {
        if(key in parsedQuery) {
            if(Array.isArray(parsedQuery[key])) {
                parsedQuery[key].push(value)
            } else {
                parsedQuery[key] = [oldValue, value]
            }

        } else {
            parsedQuery[key] = value
        }
    })

    return parsedQuery
}