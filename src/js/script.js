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