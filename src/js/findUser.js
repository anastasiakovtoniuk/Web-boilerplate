const SEARCH_FIELDS = ['full_name', 'note', 'age'];

function searchUsers(users, searchField, searchValue) {
    if (!users || !Array.isArray(users)) {
        return [];
    }

    const field = searchField.toLowerCase() === 'name' ? 'full_name' : searchField;

    if (!SEARCH_FIELDS.includes(field)) {
        return [];
    }

    const searchStr = String(searchValue).trim();

    return users.filter((user) => {
        const fieldValue = user[field];

        if (fieldValue === undefined || fieldValue === null) {
            return false;
        }

        if (typeof fieldValue === 'number') {
            const match = searchStr.match(/^([<>]=?|==?)\s*(\d+)$/);

            if (match) {
                const operator = match[1];
                const value = parseInt(match[2], 10);

                switch (operator) {
                    case '>':
                        return fieldValue > value;
                    case '<':
                        return fieldValue < value;
                    case '=':
                    case '==':
                        return fieldValue === value;
                    case '>=':
                        return fieldValue >= value;
                    case '<=':
                        return fieldValue <= value;
                    default:
                        return false;
                }
            } else {
                return fieldValue === Number(searchStr);
            }
        }

        if (typeof fieldValue === 'string') {
            return fieldValue.toLowerCase().includes(searchStr.toLowerCase());
        }

        return false;
    });
}

export default searchUsers;