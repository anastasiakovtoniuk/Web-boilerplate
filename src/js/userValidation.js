const capitalize = (s) => {
    if (typeof s !== 'string' || s.trim().length === 0) return '';
    return s.charAt(0).toUpperCase() + s.slice(1).toLowerCase();
};


export const fixUser = (user) => {
    
    
    const initialNote = user.note || 'No notes'; 

    return {
        ...user,
        
        full_name: capitalize(user.full_name || ''), 
        gender: capitalize(user.gender || ''), 
        note: capitalize(initialNote), 
        state: capitalize(user.state || user.location?.state),
        city: capitalize(user.city || user.location?.city),
        country: capitalize(user.country || user.location?.country),
        
        
        phone: user.phone || '',
        email: user.email || '',
        age: Number(user.age) || 0, 
    };
};


export const validateUser = (user) => {
    let errors = [];

    
    const isStringValid = (value, fieldName) => {
        
        if (typeof value !== 'string' || value.trim().length === 0) {
            errors.push(`'${fieldName}' is not a non-empty string.`);
            return false;
        }
        
        if (value.trim()[0] !== value.trim()[0].toUpperCase()) {
            errors.push(`'${fieldName}' must start with an uppercase letter.`);
            return false;
        }
        return true;
    };

    
    isStringValid(user.full_name, 'full_name');
    isStringValid(user.gender, 'gender');
    isStringValid(user.note, 'note'); 
    isStringValid(user.state, 'state');
    isStringValid(user.city, 'city');
    isStringValid(user.country, 'country');

    
    if (typeof user.age !== 'number' || user.age <= 0 || !Number.isInteger(user.age)) {
        errors.push("'age' must be a positive integer.");
    }

    
    if (typeof user.email !== 'string' || !user.email.includes('@')) {
        errors.push("'email' must contain '@'.");
    }

    
    if (typeof user.phone !== 'string' || user.phone.trim().length < 5) {
        errors.push("'phone' is invalid or too short.");
    }
    
    return {
        valid: errors.length === 0,
        errors: errors.join('; ')
    };
};



export function validateAndFilterUsers(users) {
    if (!Array.isArray(users)) { 
        console.error("Input is not an array.");
        return [];
    }

    return users
        .map((user, index) => {
            const fixedUser = fixUser(user); 
            const result = validateUser(fixedUser);

            if (!result.valid) { 
                console.error(`User at index ${index} is invalid (Full Name: ${fixedUser.full_name || 'N/A'}):`, result.errors);
                return null; 
            }

            return fixedUser; 
        })
        .filter(u => u !== null); 
}


export default validateAndFilterUsers;