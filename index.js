/*

- creating divs in a table shape

DATA
- fetching the data
- rendering it
- adding it to local storage
- creates a function to translate the local storage data to obj.

** all changes will be done in the obj. can update local storage for add features
** adding data-row - key number in obj.

* each change made in table will translate to updating the obj and the func to update table from obj

FUNCTIONS
- functions to update table from obj
- function to delete row (deletes key in obj)
- function to update row (recognizing from input if changed and then replace the data)


EVENT LISTENER
- on all grid,
recognizing current obj bt data=row and using it in obj to get details
*/


/// fetching data from api and rendreing it to an object

const studentsContainer = document.querySelector('.students-container');
// console.log(studentsContainer);


const myApi = 'https://apple-seeds.herokuapp.com/api/users/';

let studentsData = {};

async function collectingStudentsData() {
    // adding loader animation - -  - - - - -
    response = await fetch(myApi);
    response = await response.json();

    for (let student of response) {
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

let editedStudent;
collectingStudentsData().then(() => {
    console.log(studentsData)
    displayingData();
    // deleteRow(0);
    // editedStudent = editRow(0);
})

function displayingData() {
    studentsContainer.innerHTML = '';

    let tr = document.createElement('tr');

    tr.innerHTML =
        `<td data-type="firstName">firstName</td>
    <td data-type="lastName">lastName</td>
    <td data-type="capsule">capsule</td>
    <td data-type="gender">gender</td>
    <td data-type="age">age</td>
    <td data-type="city">city</td>
    <td data-type="hobby">hobby</td>`

    studentsContainer.appendChild(tr);

    for (let student in studentsData) {
        let tr = document.createElement('tr');

        tr.innerHTML =
            `<td data-row="${student}" data-type="firstName">${studentsData[student].firstName}</td>
        <td data-row="${student}" data-type="lastName">${studentsData[student].lastName}</td>
        <td data-row="${student}" data-type="capsule">${studentsData[student].capsule}</td>
        <td data-row="${student}" data-type="gender">${studentsData[student].gender}</td>
        <td data-row="${student}" data-type="age">${studentsData[student].age}</td>
        <td data-row="${student}" data-type="city">${studentsData[student].city}</td>
        <td data-row="${student}" data-type="hobby">${studentsData[student].hobby}</td>
        <button data-row="${student}" class='edit-button'>${studentsData[student].editButton}</button>
        <button data-row="${student}" class='delete-button'>${studentsData[student].deleteButton}</button>
        `

        studentsContainer.appendChild(tr);
    }
}


function deleteRow(rowNum) {
    delete studentsData[rowNum];
    displayingData();
}

// on event click on edit button
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
    }

    displayingData(); /// updating
    return studentData;
}

function applyEditOnRow(rowNum, studentData) {
    console.log(studentData)
    let inputs = document.querySelectorAll('input')
    let firstOne = true;
    for (let input of inputs) {
        if (!firstOne) {
            if (input.value != input.getAttribute('value')) {
                let type = input.getAttribute('data-type');
                studentData[type] = input.value;
            }
        } else firstOne = false; // ignores search input
    }

    studentsData[rowNum] = studentData;
    displayingData();
}


studentsContainer.addEventListener('click', (e) => {
    let row = e.target.getAttribute('data-row');
    if (e.target.innerText == 'Confirm') {
        console.log('confirm');
        applyEditOnRow(row, editedStudent);
    }
    if (e.target.innerText == 'Edit') {
        console.log('edit');

        editedStudent = editRow(row);
    }
    if (e.target.innerText == 'Delete') {
        console.log('del');

        deleteRow(row);
    }
    if (e.target.innerText == 'Cancel') {
        console.log('cancel');

        displayingData();
    }

})