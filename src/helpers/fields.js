const handleFields = ({body, allowedFields }) => {
    
            const updates = {};
    
            // Only accept allowed fields
            for (const field of allowedFields) {
                if (body[field] !== undefined) {
                    updates[field] = body[field];
                }
            }

    return updates
    
}


module.exports = {
    handleFields
}