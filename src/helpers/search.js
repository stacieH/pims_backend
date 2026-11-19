        const handleSearch = ({keys, value}) => {
            // Convert comma-separated search keys into an array
            const searchKeys = String(keys)
                .split(',')
                .map(key => key.trim())
                .filter(Boolean);
             
            // General search across multiple fields
            if (value && searchKeys.length > 0) {
                return searchKeys.map(searchKey => ({
                    [searchKey]: {
                        $regex: String(value),
                        $options: 'i'
                    }
                }));
            } else{
                return null
            }
        }

const handleSearchQueries = (request) => {
    const {search_keys, search_value, ...res} = request || {}

    let queries = {}

        const search = handleSearch({
            keys:search_keys, 
            value: search_value
        })

        if(search){
            queries.$or = search
        }

         // Search by specific keys
         if(res && !Array.isArray(res)){
            const resQueries = Object.keys(res)?.reduce((acc,cv)=>{
                if(cv==="status" && res[cv]){
                    acc = {...acc, [cv]:res[cv].toUpperCase()};
                }
                else if(typeof res[cv] === "boolean"){
                    // queries.is_active = true
                    acc = {...acc, [cv]: res[cv]};
                }
                else if(res[cv]){
                    // queries.sku = { $regex: sku, $options: 'i' }
                    acc = {...acc, [cv]:{ $regex: res[cv], $options: 'i' }};
                }
                return acc
            },{})

            queries = {
                ...queries,
                ...resQueries
            }
         }

    return queries
}

module.exports = {
    handleSearch,
    handleSearchQueries
}