// variables for continue use.
const studentsContainer = document.querySelector('.students-container');

const myApi = 'https://apple-seeds.herokuapp.com/api/users/';

let studentsData = {};
const headerTR =
`<th data-type="firstName">firstName</th>
<th data-type="lastName">lastName</th>
<th data-type="capsule">capsule</th>
<th data-type="gender">gender</th>
<th data-type="age">age</th>
<th data-type="city">city</th>
<th data-type="hobby">hobby</th>`;

let editedStudent; // is updated. for edit mode.



//! FUNCTIONS 

async function collectingStudentsData() { // func to collect data from API
    //TODO: add loader animation - -  - - - - -
    response = await fetch(myApi);
    response = await response.json();

    for (let student of response) { // collecting additional data for specific  student
        let responsePerUser = await fetch(`${myApi}${response[student.id].id}`);
        responsePerUser = await responsePerUser.json();

        response[student.id].age = responsePerUser.age;
        response[student.id].city = responsePerUser.city;
        response[student.id].gender = responsePerUser.gender;
        response[student.id].hobby = responsePerUser.hobby;
        response[student.id].editButton = 'Edit';
        response[student.id].deleteButton = 'Delete';

        studentsData[student.id] = response[student.id];
    }
}

function displayingData(withHeader = true, students = studentsData) { // create th and td and adding them to table in html
    studentsContainer.innerHTML = '';

    let tr = document.createElement('tr');

    withHeader ? tr.innerHTML = headerTR : tr.innerHTML = ''; // * option to use for search function. -- prevents two headers

    studentsContainer.appendChild(tr);

    for (let student in students) {
        let tr = document.createElement('tr');

        tr.innerHTML =
            `<td data-row="${student}" data-type="firstName">${students[student].firstName}</td>
        <td data-row="${student}" data-type="lastName">${students[student].lastName}</td>
        <td data-row="${student}" data-type="capsule">${students[student].capsule}</td>
        <td data-row="${student}" data-type="gender">${students[student].gender}</td>
        <td data-row="${student}" data-type="age">${students[student].age}</td>
        <td data-row="${student}" data-type="city">${students[student].city}</td>
        <td data-row="${student}" data-type="hobby">${students[student].hobby}</td>
        <button data-row="${student}" class='edit-button'>${students[student].editButton}</button>
        <button data-row="${student}" class='delete-button'>${students[student].deleteButton}</button>
        `

        studentsContainer.appendChild(tr);
    }
}

function deleteRow(rowNum) {
    delete studentsData[rowNum];
    displayingData();
}

function editRow(rowNum) {
    let studentData = studentsData[rowNum];

    studentsData[rowNum] = {
        id: studentData.id,
        firstName: `<input type="text" data-type="firstName" value="${studentData.firstName}">`,
        lastName: `<input type="text" data-type="lastName" value="${studentData.lastName}">`,
        capsule: `<input type="text" data-type="capsule" value="${studentData.capsule}">`,
        age: `<input type="text" data-type="age" value="${studentData.age}">`,
        city: `<input type="text" data-type="city" value="${studentData.city}">`,
        gender: `<input type="text" data-type="gender" value="${studentData.gender}">`,
        hobby: `<input type="text" data-type="hobby" value="${studentData.hobby}">`,
        editButton: 'Confirm',
        deleteButton: 'Cancel'
    } //  replace text to input.

    displayingData(); /// * updating
    return studentData; //* to save original student data.
}

function applyEditOnRow(rowNum, studentData, confirm = true) {
    if (confirm){
    let inputs = document.querySelectorAll('input')
    let firstInput = true;// ignores search input (the first input)
    for (let input of inputs) {
        if (!firstInput) {
            if (input.value != input.getAttribute('value')) {
                let type = input.getAttribute('data-type');
                studentData[type] = input.value;
            }
        } else firstInput = false; 
    }
    }
    studentsData[rowNum] = studentData;
    displayingData();
}

function searching(value){
    displayingData(false);
    let allRows =  document.querySelectorAll('tr');
    studentsContainer.innerHTML = headerTR;
    for (let i in allRows) {
        if (allRows[i].textContent.toLowerCase().includes(value.toLowerCase())){
            studentsContainer.appendChild(allRows[i])
        }
    }
} // TODO: fix ERROR (doesn't break - throws error in console because all allRows becomes shorter)


function sortBy(typeToSort){ // fix
    let studentsArray = [];

    for (let student of Object.values(studentsData)){
        studentsArray.push([student[typeToSort], student.id]);
    }
    
    studentsArray.sort();

    let sortedObj = {};
    let count = 0;
    for (student of studentsArray){
        sortedObj[count++] = studentsData[student[1]]
    }

    displayingData(true, sortedObj);
}


//! EVENT LISTENERS

studentsContainer.addEventListener('click', (e) => {
    let row = e.target.getAttribute('data-row');
    if (e.target.innerText == 'Confirm') {
        applyEditOnRow(row, editedStudent);
    }
    if (e.target.innerText == 'Edit') {
        editedStudent = editRow(row);
    }
    if (e.target.innerText == 'Delete') {
        deleteRow(row);
    }
    if (e.target.innerText == 'Cancel') {
        applyEditOnRow(row, editedStudent, false);
    }
})

document.querySelector('input').addEventListener('input', (event) => {
    searching(event.target.value)
});


document.querySelector('select').addEventListener('input', (event) => {
    sortBy(event.target.value);
});


// program:

collectingStudentsData().then(() => {// from API
    displayingData();
}); 



// TODO:
// - add loader.
// - add weather widget.