const COURSES_LIST = [
  'Mathematics', 'Physics', 'English', 'Computer Science', 'Dancing',
  'Chess', 'Biology', 'Chemistry', 'Law', 'Art', 'Medicine', 'Statistics',
];

const getRandomColor = () => {
  return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
};

const getRandomElem = (array) => {
  return array[Math.floor(Math.random() * array.length)];
};

const calculateAge = (birthDateStr) => {
  const birth = new Date(birthDateStr);
  const diff_ms = Date.now() - birth.getTime();
  const age_dt = new Date(diff_ms);
  return Math.abs(age_dt.getUTCFullYear() - 1970);
};


const normalizeUser = (user) => {
  const normalized = {
    gender: user.gender,
    title: user.title || user.name?.title,
    full_name: user.full_name || `${user.name?.first || ''} ${user.name?.last || ''}`.trim(),
    email: user.email,
    b_date: user.b_date || user.dob?.date,
    age: user.age || user.dob?.age,
    phone: user.phone,

    ...user,

    
    favorite: user.favorite ?? null,
    course: user.course || null,
    bg_color: user.bg_color || null,
    note: user.note || null,
  };

  delete normalized.name;
  delete normalized.dob;

  return normalized;
};


const mergeUserData = (existingUser, newUser) => {
  const merged = { ...existingUser };

  for (const key in newUser) {
    if (newUser[key] != null) {
      const existingValue = existingUser[key];
      const newValue = newUser[key];

      if (typeof newValue === 'object' && newValue !== null && !Array.isArray(newValue)) {
        merged[key] = mergeUserData(existingValue || {}, newValue);
      } else if (
        existingValue == null ||
        (typeof existingValue === 'string' && existingValue.trim() === '') ||
        (typeof existingValue === 'number' && existingValue === 0 && newValue !== 0)
      ) {
        merged[key] = newValue;
      } else if (key === 'favorite' && existingValue === false && newValue === true) {
        merged[key] = true;
      }
    }
  }
  return merged;
};


const finalizeUser = (user) => {
  const finalized = { ...user };

  
  finalized.id =
    user.login?.uuid ||
    user.id ||
    user.email ||
    user.phone ||
    `${Date.now()}-${Math.random()}`;

  if (!finalized.course) {
    finalized.course = getRandomElem(COURSES_LIST);
  }
  if (!finalized.bg_color) {
    finalized.bg_color = getRandomColor();
  }
  if (finalized.favorite === null || finalized.favorite === undefined) {
    finalized.favorite = false;
  }
  if (!finalized.note) {
    finalized.note = '';
  }
  if (!finalized.age && finalized.b_date) {
    finalized.age = calculateAge(finalized.b_date);
  }

  return finalized;
};


export function mergeAndFormatUsers(mockUsers, additionalUsers) {
  const allNormalizedUsers = [...mockUsers, ...additionalUsers].map(normalizeUser);

  const userMap = new Map();

  allNormalizedUsers.forEach((user) => {
    
    const primaryKey = user.login?.uuid || user.id || user.email;

    if (!primaryKey) {
      userMap.set(crypto.randomUUID(), user);
      return;
    }

    const existingUser = userMap.get(primaryKey);

    if (existingUser) {
      const merged = mergeUserData(existingUser, user);
      userMap.set(primaryKey, merged);
    } else {
      userMap.set(primaryKey, user);
    }
  });

  return Array.from(userMap.values()).map(finalizeUser);
}

export default mergeAndFormatUsers;
