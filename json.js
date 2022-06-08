var coursesApi = 'http://localhost:3000/courses';

var createBtn = document.querySelector('#create');




function start() {
    getCourse(renderCourses);

    handleCreateForm();
    
}

start();


function getCourse(callback) {
    fetch(coursesApi)
    .then(function(response) {
        return response.json();
    })
    
    .then(callback);
}

function createCourse(data, callback) {
    var options = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: JSON.stringify(data)  
        
    };


    fetch(coursesApi, options)
        .then(function(response) {
            return response.json();
        })

        .then(callback);
}

function handelDeleteCourse(id) {
    var options = {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json'
            // 'Content-Type': 'application/x-www-form-urlencoded',
        },
    
        
    };


    fetch(coursesApi + '/' + id, options)
        .then(function(response) {
            return response.json();
        })

        .then(function() {
            var courseItems = document.querySelector('.list-item-' + id);
            courseItems.remove();
        });
}

function renderCourses(courses) {
    var listCoursesBlock = document.querySelector('.list-courses');

    var htmls = courses.map(function(course) {
        return `
            <li class="list-item-${course.id}">
                <h4 class="course-item-${course.id}">${course.name}</h4>
                <p class="course-item-${course.id}">${course.description}</p>

                <button onclick="handelDeleteCourse(${course.id})">Xóa</button>
                <button id ="edit" onclick="handleEditCourse(${course.id}, hienThi(this))">Change</button>  
            </li>
                <div class = "update-input">
                    <div>
                        <input type="text" name="name-update" >
                    </div>
                    <div>
                        <input type="text" name="description-update">
                    </div>
                    
                </div>
        `
    })

    listCoursesBlock.innerHTML = htmls.join('')
}

function handleCreateForm() {
    var createBtn = document.querySelector('#create');

    createBtn.onclick = function() {
        var name = document.querySelector('input[name="name"]').value;
        var description = document.querySelector('input[name="description"]').value;
        
        var formData = {
            name: name,
            description: description
        };

        createCourse(formData, function() {
            getCourse(renderCourses);
        });
    }
}

// update

function editCourse(data, callback) {
    var options = {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
    };
    fetch(coursesApi + '/' + data.id, options)
        .then(function(response) {
            response.json();
        })
        .then(callback)
}

function handleEditCourse(id) {
    var courseItem = document.querySelector('.list-item-' + id);
    if (courseItem) {
        document.querySelector('input[name="name-update"]').value = courseItem.querySelector('h4').innerText;
        document.querySelector('input[name="description-update"]').value = courseItem.querySelector('p').innerText;

        var editBtn = document.querySelector('#edit');
        var createBtn = document.querySelector('#create');
        // var btnOn = document.querySelector('.update-input');
        editBtn.style.display = "block";
        createBtn.style.display = "none";
           
        
            
            
        
        
        
            // btnOn.classList.toggle('active');
        
    }
   

    editBtn.onclick = function() {
        var name = document.querySelector('input[name="name-update"]').value;
        var description = document.querySelector('input[name="description-update"]').value;
        
        var formData = {
            name: name,
            description: description,
            id: id
        };

        editCourse(formData, function () {
            getCourse(renderCourses);
            // document.querySelector('input[name="name"]').value = '';
            // document.querySelector('input[name="description"]').value = '';
            // editBtn.style.display = "none";
            // createBtn.style.display = "block";
        });
    }
}

function hienThi(e) {
    e.parentElement.parentElement.querySelector('.update-input').classList.add('active');
}


