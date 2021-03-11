// variables for continue use.
const studentsContainer = document.querySelector('.students-container');

const myApi = 'https://apple-seeds.herokuapp.com/api/users/';

let studentsData = {};
const headerTR =
`<td data-type="firstName">firstName</td>
<td data-type="lastName">lastName</td>
<td data-type="capsule">capsule</td>
<td data-type="gender">gender</td>
<td data-type="age">age</td>
<td data-type="city">city</td>
<td data-type="hobby">hobby</td>`;

let editedStudent; // is updated. for edit mode.


// FUNCTIONS ---------

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

function displayingData(withHeader = true) { // create th and td and adding them to table in html
    studentsContainer.innerHTML = '';

    let tr = document.createElement('tr');

    withHeader ? tr.innerHTML = headerTR : tr.innerHTML = ''; //// for search function.


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
    } // replace text to input.

    displayingData(); /// updating
    return studentData; // to save original student data.
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
    for (let i in allRows) { // i = 1, to skip first row of headers
        if (allRows[i].textContent.toLowerCase().includes(value.toLowerCase())){
            studentsContainer.appendChild(allRows[i])
        } /// trow ERROR because all allRows becomes shorter
    }
}

function sortBy(typeToSort){ // fix
    let studentsArray = [];
    console.log(studentsArray);
    for (let student of Object.values(studentsData)){
        for (let s of student){
            console.log(s)
        }
        console.log(Array.of(student));
        studentsArray.push(student);
    }
    
    let sortedByType = [];
    
    studentsArray = [...studentsArray].sort((a,b) =>{
        console.log(a[typeToSort]);
        
        return a[typeToSort] - b[typeToSort]
    });

    console.log(studentsArray);
}


// EVENT LISTENERS ------

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
        applyEditOnRow(row, editedStudent, false); // need to fix!!!
    }
})

document.querySelector('input').addEventListener('input', (event) => {
    searching(event.target.value)
});


// program:

collectingStudentsData(); // from API