import mergeAndFormatUsers from './mergeUsers.js'; 
import validateAndFilterUsers  from './userValidation.js'; 
import filterUsers from './filterUsers.js'; 
import sortUsers  from './sortingUsers.js'; 
import searchUsers from './findUser.js';
import { randomUserMock, additionalUsers } from './FE4U-Lab2-mock.js'; 
import  getPercentageOfFound  from './percentUsers.js';

const RAW_DATA = mergeAndFormatUsers(randomUserMock, additionalUsers);
const GLOBAL_USERS_DATA = validateAndFilterUsers(RAW_DATA);

console.log('1');
console.log('Початковий масив:');
console.log(RAW_DATA);
console.log(`Кількість сирих об'єктів: ${RAW_DATA.length}`);
console.log(`Кількість валідованих об'єктів: ${GLOBAL_USERS_DATA.length}`);

const filtered = filterUsers(GLOBAL_USERS_DATA, {
    country: 'Canada', 
    age: 30,           
    gender: 'female',  
    favorite: true     
});

console.log('\n2');
console.log('Відфільтровані користувачі (Canada, 30, female, favorite):');
console.log(filtered);
console.log(`Кількість знайдених: ${filtered.length}`);

const sorted = sortUsers(GLOBAL_USERS_DATA, 'age', 'desc'); 

console.log('\n3');
console.log('Відсортовані за віком (спадання):');
console.log(sorted.slice(0, 5));

const searchName = 'John';
const searchedByName = searchUsers(GLOBAL_USERS_DATA, 'full_name', searchName);

const searchAgeValue = '>40';
const searchedByAge = searchUsers(GLOBAL_USERS_DATA, 'age', searchAgeValue);

console.log('\n4');
console.log(`Пошук за 'full_name' (включно 'John'):`);
console.log(searchedByName.slice(0, 5));
console.log(`Кількість знайдених: ${searchedByName.length}`);

console.log(`\n5`);
console.log(searchedByAge.slice(0, 5));
console.log(`кількість знайдених: ${searchedByAge.length}`);


const searchField = 'age';
const searchValue = '<=25'; 
const percentage = getPercentageOfFound(GLOBAL_USERS_DATA, searchField, searchValue); 

console.log('\n6');
console.log(`умова: ${searchField} ${searchValue}`);
console.log(`відсоток користувачів, які відповідають умові: ${percentage}%`);


const USERS = GLOBAL_USERS_DATA; 


const FAV_KEY = 'teacher_favorites_v1';
const favSet  = new Set(JSON.parse(localStorage.getItem(FAV_KEY) || '[]'));
const saveFavs = () => localStorage.setItem(FAV_KEY, JSON.stringify([...favSet]));

const grid = document.querySelector('.teachers-grid');
const modal = document.getElementById('teacher-modal');
const details = document.getElementById('teacher-details');
const favCarousel = document.querySelector('.favorites .favorites-carousel .carousel-items');


const getPhoto = (u) => u.picture?.large || u.picture?.medium || u.picture?.thumbnail || '';
const getInitials = (name='') => name.trim().split(/\s+/).map(w => w[0] || '').join('').slice(0,2).toUpperCase();

function cardHTML(u) {
  const isFav = favSet.has(u.id);
  const photo = getPhoto(u);
  const initials = getInitials(u.full_name || 'T');
  return `
    <div class="teacher-card" data-id="${u.id}">
      <div class="photo ${photo ? '' : 'initial'}" style="${u.bg_color ? `background:${u.bg_color}` : ''}">
        ${photo ? `<img src="${photo}" alt="${u.full_name || 'Teacher'}">` : initials}
        <button class="fav-btn" aria-pressed="${isFav}" title="Add to favorites">${isFav ? '★' : '☆'}</button>
      </div>
      <h3>${u.full_name || 'No name'}</h3>
      <p>${u.course || '—'}</p>
      <p>${u.country || u.location?.country || '—'}</p>
    </div>
  `;
}

function renderGrid(list = USERS) {
  if (!grid) return;
  grid.innerHTML = list.map(cardHTML).join('');
}

function renderFavorites() {
  if (!favCarousel) return;
  const favUsers = USERS.filter(u => favSet.has(u.id));
  favCarousel.innerHTML = favUsers.map(u => `
    <div class="favorite-card" data-id="${u.id}">
      <div class="photo ${getPhoto(u) ? '' : 'initial'}">
        ${getPhoto(u) ? `<img src="${getPhoto(u)}" alt="${u.full_name || 'Teacher'}">` : getInitials(u.full_name)}
      </div>
      <h3>${u.full_name || 'No name'}</h3>
      <p>${u.course || ''}</p>
    </div>
  `).join('');
}


function openDetails(id) {
  const u = USERS.find(x => String(x.id) === String(id));
  if (!u) return;

  const photo = getPhoto(u);
  const isFav = favSet.has(u.id);

  details.innerHTML = `
    <div class="td-modal">
      <div class="td-header">
        <h3>Teacher Info</h3>
        <button class="td-close" aria-label="Close">×</button>
      </div>

      <div class="td-body">
        <div class="td-portrait">
          ${photo
            ? `<img src="${photo}" alt="${u.full_name || 'Teacher'}">`
            : `<img src="https://via.placeholder.com/600x400?text=No+photo" alt="${u.full_name || 'Teacher'}">`}
        </div>

        <div class="td-summary">
          <button class="td-fav-btn" aria-pressed="${isFav ? 'true':'false'}" title="Add to favorites">★</button>
          <h2>${(u.full_name || 'No name')}</h2>
          <div class="td-subject">${u.course || '—'}</div>
          <ul class="td-meta">
            <li>${[u.gender, u.age && `${u.age} y.o.`].filter(Boolean).join(', ')}</li>
            <li>${[u.country || u.location?.country, u.city].filter(Boolean).join(', ')}</li>
            ${u.email ? `<li><a href="mailto:${u.email}">${u.email}</a></li>` : ''}
            ${u.phone ? `<li><a href="tel:${u.phone}">${u.phone}</a></li>` : ''}
          </ul>
        </div>
      </div>

      <div class="td-desc">${u.note || 'No notes'}</div>
      <div class="td-map"><a class="td-toggle-map" href="#">toggle map</a></div>
    </div>
  `;

  
  details.querySelector('.td-close')?.addEventListener('click', () => modal.close());
  details.querySelector('.td-fav-btn')?.addEventListener('click', (e) => {
    if (favSet.has(u.id)) favSet.delete(u.id); else favSet.add(u.id);
    saveFavs();
    e.currentTarget.setAttribute('aria-pressed', favSet.has(u.id) ? 'true' : 'false');
    renderGrid();      
    renderFavorites();
  });

  if (!modal.open) modal.showModal();
}


grid?.addEventListener('click', (e) => {
  const favBtn = e.target.closest('.fav-btn');
  const card = e.target.closest('.teacher-card');
  if (!card) return;

  const id = card.dataset.id;
  if (!id) return;

  if (favBtn) {
    
    favSet.has(id) ? favSet.delete(id) : favSet.add(id);
    saveFavs();
    favBtn.setAttribute('aria-pressed', favSet.has(id));
    favBtn.textContent = favSet.has(id) ? '★' : '☆';
    renderFavorites();
    return; 
  }

  openDetails(id);
});

modal?.addEventListener('click', (e) => {
  if (e.target.classList.contains('close-btn') || e.target === modal) {
    modal.close();
  }
  if (e.target.classList.contains('toggle-fav')) {
    const id = e.target.dataset.id;
    if (!id) return;
    favSet.has(id) ? favSet.delete(id) : favSet.add(id);
    saveFavs();
    renderGrid();      
    renderFavorites(); 
    openDetails(id);   
  }
});

const filtersForm = document.getElementById('filters-form');
const countrySelect = filtersForm?.querySelector('select[name="country"]');


if (countrySelect) {
  const countries = Array.from(
    new Set(USERS.map(u => u.country || u.location?.country).filter(Boolean))
  ).sort();
  for (const c of countries) {
    const opt = document.createElement('option');
    opt.value = c;
    opt.textContent = c;
    countrySelect.appendChild(opt);
  }
}


function applyFilters() {
  const form = document.getElementById('filters-form');
  if (!filtersForm) return USERS;
  const fd = new FormData(filtersForm);

  const ageRange = (fd.get('ageRange') || '').trim(); 
  const onlyFav = fd.get('favorite') === 'on';

   const criteria = {
    country: fd.get('country') || null,
    gender:  fd.get('gender')  || null
  };

  
  let list = filterUsers(USERS, criteria);
   
  if (onlyFav) {
    list = list.filter(u => favSet.has(u.id));
  }

  
 if (ageRange) {
    let min = -Infinity, max = Infinity;
    if (ageRange.includes('-')) {
      const [a, b] = ageRange.split('-').map(Number);
      min = a; max = b;
    } else if (ageRange.endsWith('+')) {
      min = Number(ageRange.replace('+','')) || -Infinity;
    }
    list = filterUsers(list, { age: { min, max } });
  }

  return list;
}


filtersForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  renderGrid(applyFilters());
});

filtersForm?.addEventListener('reset', () => {
  
  setTimeout(() => renderGrid(USERS), 0);
});

//stastistics
const statsTable = document.querySelector('.statistics table');
const statsThead = statsTable?.querySelector('thead');
const statsTbody = statsTable?.querySelector('tbody');

const esc = (s='') => String(s)
  .replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;')
  .replace(/"/g,'&quot;').replace(/'/g,'&#039;');

const cap = s => s ? (s[0].toUpperCase() + s.slice(1).toLowerCase()) : s;

function renderStatisticsTable(list = USERS) {
  if (!statsTbody) return;
  statsTbody.innerHTML = list.map(u => {
    const country = u.country || u.location?.country || '';
    const bsrc = u.b_day || u.b_date || u.dob?.date || '';
    const bday = bsrc ? new Date(bsrc).toISOString().slice(0,10) : '';
    return `
      <tr>
        <td>${esc(u.full_name || '')}</td>
        <td>${esc(u.course || '')}</td>
        <td>${Number(u.age) || ''}</td>
        <td>${esc(cap(u.gender || ''))}</td>
        <td>${esc(country)}</td>
        <td>${esc(bday)}</td>
      </tr>
    `;
  }).join('');
}

let statsSort = { field: null, dir: 'asc' };

function updateSortIndicators(field, dir) {
  if (!statsThead) return;
  statsThead.querySelectorAll('th[data-sort]').forEach(th => {
    th.querySelector('.sort-ind')?.remove();
    th.removeAttribute('aria-sort');
    if (th.dataset.sort === field) {
      const s = document.createElement('span');
      s.className = 'sort-ind';
      s.textContent = dir === 'asc' ? '▲' : '▼';
      th.appendChild(s);
      th.setAttribute('aria-sort', dir);
    }
  });
}

function attachStatisticsSorting() {
  if (!statsThead) return;
  statsThead.querySelectorAll('th[data-sort]').forEach(th => {
    th.addEventListener('click', () => {
      const field = th.dataset.sort;
      const dir = (statsSort.field === field && statsSort.dir === 'asc') ? 'desc' : 'asc';
      statsSort = { field, dir };
      const sorted = sortUsers(USERS, field, dir);
      renderStatisticsTable(sorted);
      updateSortIndicators(field, dir);
    });
  });
}
//search
const searchFormEl  = document.getElementById('search-form');
const searchInputEl = searchFormEl?.querySelector('input[name="q"]');
const searchFieldEl = searchFormEl?.querySelector('select[name="field"]');

function getBaseList() {
  return (typeof applyFilters === 'function') ? applyFilters() : USERS;
}

function runSearch() {
  const q = (searchInputEl?.value || '').trim();
  const field = (searchFieldEl?.value || (typeof DEFAULT_SEARCH_FIELD !== 'undefined' ? DEFAULT_SEARCH_FIELD : 'name'))
                .toLowerCase();

  const base = getBaseList();
  const results = q ? searchUsers(base, field, q) : base;

  renderGrid?.(results);
  if (typeof renderStatisticsTable === 'function') renderStatisticsTable(results);
}

searchFormEl?.addEventListener('submit', (e) => { e.preventDefault(); runSearch(); });
searchInputEl?.addEventListener('input', () => { if (!searchInputEl.value.trim()) runSearch(); });



//(teach_add_popup)
const addTeacherModal = document.querySelector('.add-teacher-modal');
const addTeacherCloseBtn = addTeacherModal?.querySelector('.close');
const openAddTeacherBtn = document.querySelector('.add-teacher-btn');
const addTeacherForm = document.getElementById('add-teacher-form');


openAddTeacherBtn?.addEventListener('click', () => { addTeacherModal.style.display = 'block'; });
addTeacherCloseBtn?.addEventListener('click', () => { addTeacherModal.style.display = 'none'; });
addTeacherModal?.addEventListener('click', (e) => {
  if (e.target === addTeacherModal) addTeacherModal.style.display = 'none';
});


function computeAgeFromISO(s) {
  if (!s) return 0;
  const d = new Date(s);
  if (isNaN(d)) return 0;
  const now = new Date();
  let age = now.getFullYear() - d.getFullYear();
  const m = now.getMonth() - d.getMonth();
  if (m < 0 || (m === 0 && now.getDate() < d.getDate())) age--;
  return age;
}
function htmlEsc(s = '') {
  return String(s)
    .replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;').replace(/'/g, '&#039;');
}


function refreshCountryOptions() {
  const sel = document.querySelector('#filters-form select[name="country"]');
  if (!sel) return;
  const keep = sel.value;
  const countries = [...new Set(USERS.map(u => u.country).filter(Boolean))]
    .sort((a, b) => String(a).localeCompare(String(b), undefined, { sensitivity: 'base' }));
  sel.innerHTML = `<option value="">All countries</option>` +
    countries.map(c => `<option value="${htmlEsc(c)}">${htmlEsc(c)}</option>`).join('');
  if (keep && countries.some(c => c.toLowerCase() === keep.toLowerCase())) sel.value = keep;
}


function buildTeacherFromForm(fd) {
  const b_date = fd.get('b_date');
  const gender = (fd.get('gender') || '').toString().toLowerCase();
  const full_name = (fd.get('name') || '').toString().trim();

  const user = {
    id: (crypto?.randomUUID?.() || `${Date.now()}-${Math.random().toString(36).slice(2,8)}`),
    full_name,
    course: (fd.get('course') || '').toString().trim(),
    country: (fd.get('country') || '').toString().trim(),
    city: (fd.get('city') || '').toString().trim(),
    email: (fd.get('email') || '').toString().trim(),
    phone: (fd.get('phone') || '').toString().trim(),
    b_date,
    gender,
    note: (fd.get('note') || '').toString().trim() || 'No notes',
    bg_color: fd.get('bg_color') || null,
    
  };

  user.age = computeAgeFromISO(b_date);

  
  try {
    if (typeof fixUser === 'function') Object.assign(user, fixUser(user));
    if (typeof validateUser === 'function') {
      const v = validateUser(user);
      if (v === false) throw new Error('Validation failed');
      if (v && typeof v === 'object') Object.assign(user, v);
    }
  } catch (_) {  }

  return user;
}


addTeacherForm?.addEventListener('submit', (e) => {
  e.preventDefault();
  const fd = new FormData(addTeacherForm);

  if (!fd.get('name') || !fd.get('course') || !fd.get('country') || !fd.get('b_date') || !fd.get('gender')) {
    return; 
  }

  const newUser = buildTeacherFromForm(fd);
  USERS.unshift(newUser);

  const list = (typeof applyFilters === 'function') ? applyFilters() : USERS;
  if (typeof renderGrid === 'function') renderGrid(list);
  if (typeof renderStatisticsTable === 'function') renderStatisticsTable(list);
  refreshCountryOptions();

  addTeacherModal.style.display = 'none';
  addTeacherForm.reset();
});


renderStatisticsTable(USERS);
attachStatisticsSorting();

renderGrid();        
renderFavorites();   

