const singleSorting = ({
    sort_keys,
    sort_by,
    sort_order
}) => {
     const sortKey = sort_keys.includes(sort_by)
                ? sort_by
                : 'createdAt';
    
            const sortDirection = sort_order?.toLowerCase?.() === 'asc' ? 1 : -1;
    
            return { sortKey, sortDirection }
}

module.exports = {
    singleSorting
}