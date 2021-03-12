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
    let response = await fetch(myApi);
    response = await response.json();

    await Promise.all(
        response.map(async (el, i) => {
            let responsePerUser = await fetch(`${myApi}${i}`);

            responsePerUser = await responsePerUser.json();

            response[el.id].age = responsePerUser.age;
            response[el.id].city = responsePerUser.city;
            response[el.id].gender = responsePerUser.gender;
            response[el.id].hobby = responsePerUser.hobby;
            response[el.id].editButton = 'Edit';
            response[el.id].deleteButton = 'Delete';

            studentsData[el.id] = response[el.id];
        }))
    
    document.querySelector('.spinner-container').style.display = 'none'; // hide loader when data finshed loading
}


function displayingData(students = studentsData) { // create th and td and adding them to table in html
    studentsContainer.innerHTML = '';

    let tr = document.createElement('tr');
    tr.innerHTML = headerTR;
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
    if (confirm) {
        let inputs = document.querySelectorAll('input')
        let firstInput = true; // ignores search input (the first input)
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

function searching(value) {
    displayingData(); // false
    let allRows = document.querySelectorAll('tr');
    studentsContainer.innerHTML = ''; // headerTH

    let isHeader = true; // * so to skip the header of the table
    for (let i in allRows) {
        if (isHeader) {
            studentsContainer.appendChild(allRows[i]);
            isHeader = false;
        } else {
            if (allRows[i].textContent.toLowerCase().includes(value.toLowerCase())) {
                studentsContainer.appendChild(allRows[i])
            }
        }
    }
} // TODO: fix ERROR (doesn't break - throws error in console because all allRows becomes shorter)


function sortBy(typeToSort) {
    let studentsArray = [];

    for (let student of Object.values(studentsData)) {
        studentsArray.push([student[typeToSort], student.id]);
    }

    studentsArray.sort(); // * create array to sort him by the type to sort

    let sortedObj = {};
    let count = 0;
    for (student of studentsArray) {
        sortedObj[count++] = studentsData[student[1]] // creating new students obj by order of the sort
    }

    displayingData(sortedObj);
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
collectingStudentsData().then(() => {
    displayingData();
});



// TODO:
// - add weather widget.


// ? weather

studentsContainer.addEventListener('mouseover', (event) => {
    if (event.target.getAttribute('data-type') == 'city') {
        event.target.innerText != 'city' && console.log(event.target.innerText);
        // fetch weather here.
    }
})


async function fetchWeather(city) {
    null;
}