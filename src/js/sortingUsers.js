const VALID = ['full_name', 'course', 'age', 'b_day', 'country'];

function sortKey(u, field) {
  switch (field) {
    case 'full_name': return u.full_name ?? '';
    case 'course':    return u.course ?? '';
    case 'country':   return u.country ?? u.location?.country ?? '';
    case 'age':       return Number(u.age) || 0;
    case 'b_day': {
      
      const d = u.b_day || u.b_date || u.dob?.date || null;
      return d ? new Date(d).getTime() : -Infinity;
    }
    default:          return u[field];
  }
}

export default function sortUsers(users, field, dir = 'asc') {
  if (!Array.isArray(users) || !users.length) return [];
  if (!VALID.includes(field)) return users;
  const mul = (String(dir).toLowerCase() === 'desc') ? -1 : 1;

  const copy = [...users];
  copy.sort((a, b) => {
    const A = sortKey(a, field);
    const B = sortKey(b, field);

    if (field === 'age' || field === 'b_day') {
      const diff = (Number(A) || 0) - (Number(B) || 0);
      return diff * mul;
    }
    return String(A).localeCompare(String(B), undefined, { sensitivity: 'base' }) * mul;
  });
  return copy;
}
