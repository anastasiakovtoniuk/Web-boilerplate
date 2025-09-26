import findUser from './findUser.js';

export function getPercentageOfFound(users, searchField, searchValue) {
    if (!Array.isArray(users) || users.length === 0) {
        return 0;
    }

    const totalCount = users.length;
    
    const foundUsers = findUser(users, searchField, searchValue);
    
    const foundCount = foundUsers.length;

    const percentage = (foundCount / totalCount) * 100;
    
    return parseFloat(percentage.toFixed(2));
}

export default getPercentageOfFound;