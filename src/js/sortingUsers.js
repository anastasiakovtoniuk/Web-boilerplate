const VALID_SORT_FIELDS = ['full_name', 'age', 'b_day', 'country'];

function sortUsers(users, sortBy, direction = 'asc') {
    if (!Array.isArray(users) || users.length === 0) {
        return [];
    }
    
    const sortField = sortBy ? sortBy.toLowerCase() : null;

    if (!sortField || !VALID_SORT_FIELDS.includes(sortField)) {
        return users;
    }

    const directionMultiplier = (direction && direction.toLowerCase() === 'desc') ? -1 : 1;
    
    const sortedUsers = [...users];

    sortedUsers.sort((a, b) => {
        const aValue = a[sortField];
        const bValue = b[sortField];

        const aExists = aValue !== undefined && aValue !== null;
        const bExists = bValue !== undefined && bValue !== null;

        if (!aExists && !bExists) return 0;
        if (!aExists) return -1 * directionMultiplier;
        if (!bExists) return 1 * directionMultiplier;
        
        let comparison = 0;

        if (sortField === 'age') {
            const aNum = Number(aValue);
            const bNum = Number(bValue);
            comparison = aNum - bNum;
        } 
        else {
            comparison = String(aValue).localeCompare(String(bValue));
        }

        return comparison * directionMultiplier;
    });

    return sortedUsers;
}

export default sortUsers;   