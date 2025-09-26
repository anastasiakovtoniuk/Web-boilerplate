function filterUsers(users, filters) {
    if (!users || !Array.isArray(users)) {
        return [];
    }

    const filterKeys = Object.keys(filters).filter(key => filters[key] !== undefined && filters[key] !== null);

    if (filterKeys.length === 0) {
        return users;
    }

    return users.filter(user => {
        return filterKeys.every(key => {
            const filterValue = filters[key];
            const userValue = user[key];

            switch (key) {
                case 'age':
                    return typeof userValue === 'number' && userValue >= filterValue;

                case 'favorite':
                    return userValue === filterValue;

                case 'country':
                case 'gender':
                    if (typeof userValue === 'string' && typeof filterValue === 'string') {
                        return userValue.toLowerCase() === filterValue.toLowerCase();
                    }
                    return false;

                default:
                    return userValue === filterValue;
            }
        });
    });
}

export default filterUsers;