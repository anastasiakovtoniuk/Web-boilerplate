export default function filterUsers(users, filters = {}) {
  if (!Array.isArray(users)) return [];

  const keys = Object.keys(filters).filter(k => {
    const v = filters[k];
    return v !== undefined && v !== null && v !== '';
  });

  if (keys.length === 0) return users;

  return users.filter(u => keys.every(k => {
    const fv = filters[k];
    const uv = u[k];

    switch (k) {
      case 'country':
      case 'gender':
      case 'full_name':
      case 'note':
        return String(uv || '').toLowerCase() === String(fv).toLowerCase();

      case 'age':
        
        if (fv && typeof fv === 'object') {
          const min = Number.isFinite(fv.min) ? fv.min : -Infinity;
          const max = Number.isFinite(fv.max) ? fv.max :  Infinity;
          const age = Number(u.age);
          return Number.isFinite(age) && age >= min && age <= max;
        }
        return Number(uv) === Number(fv);

      default:
        
        if (typeof fv === 'function') return !!fv(u, uv);
        return uv === fv;
    }
  }));
}
