const COURSES = [
  'Mathematics','Physics','Chemistry','Biology',
  'Computer Science','Art','Law','English','Statistics'
];

function pickCourseByUUID(uuid = '') {
  let h = 0;
  for (let i = 0; i < uuid.length; i++) h = (h * 31 + uuid.charCodeAt(i)) | 0;
  return COURSES[Math.abs(h) % COURSES.length];
}

function capitalize(s=''){ return s ? (s[0].toUpperCase() + s.slice(1).toLowerCase()) : s; }

export function mapRandomUser(apiUser) {
  const id   = apiUser?.login?.uuid || crypto.randomUUID();
  const first = apiUser?.name?.first || '';
  const last  = apiUser?.name?.last  || '';
  const full_name = `${first} ${last}`.trim();

  const location = {
    city:    apiUser?.location?.city    || '',
    state:   apiUser?.location?.state   || '',   
    country: apiUser?.location?.country || '',
  };

  return {
    id,
    full_name,
    course: pickCourseByUUID(id),
    age: apiUser?.dob?.age ?? 0,
    b_date: apiUser?.dob?.date || null,
    gender: (apiUser?.gender || '').toLowerCase(),
    country: location.country,
    state: location.state,
    city: location.city,
    email: apiUser?.email || '',
    phone: apiUser?.phone || '',
    picture: apiUser?.picture || null,   
    note: 'No notes',
  };
}

export async function fetchRandomUsers({ results = 50, page = 1, seed = 'teachinder' } = {}) {
  const url = `https://randomuser.me/api/?results=${results}&page=${page}&seed=${encodeURIComponent(seed)}&inc=gender,name,location,email,phone,dob,login,picture&noinfo`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP ${res.status}`);
  const json = await res.json();
  return (json?.results || []).map(mapRandomUser);
}
