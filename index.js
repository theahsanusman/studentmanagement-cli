import inquirer from "inquirer";
class Person {
    id;
    name;
    age;
    constructor(id, name, age) {
        this.id = id;
        this.name = name;
        this.age = age;
    }
    getName() {
        return this.name;
    }
}
class Student extends Person {
    rollNumber;
    courses;
    constructor(id, name, age, rollNumber, courses) {
        super(id, name, age);
        this.rollNumber = rollNumber;
        this.courses = courses;
    }
    registerForCourse(course) {
        this.courses.push(course);
    }
}
class Instructor extends Person {
    salary;
    courses;
    constructor(id, name, age, salary, courses) {
        super(id, name, age);
        this.salary = salary;
        this.courses = courses;
    }
    assignCourse(course) {
        this.courses.push(course);
    }
}
class Course {
    id;
    name;
    students;
    instructor;
    constructor(id, name, students, instructor) {
        this.id = id;
        this.name = name;
        this.students = students;
        this.instructor = instructor;
    }
    addStudent(student) {
        this.students.push(student);
    }
    setInstructor(instructor) {
        this.instructor = instructor;
    }
}
class Department {
    id;
    name;
    courses;
    constructor(id, name, courses) {
        this.id = id;
        this.name = name;
        this.courses = courses;
    }
    addCourse(course) {
        this.courses.push(course);
    }
}
const students = {};
const instructors = {};
const courses = {};
const departments = {};
function generateUniqueId() {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    const charactersLength = characters.length;
    let id = '';
    for (let i = 0; i < 10; i++) {
        id += characters.charAt(Math.floor(Math.random() * charactersLength));
    }
    return id;
}
function viewStudents() {
    Object.keys(students).length ? console.table(students) : console.log('No Students.');
    startStudentManagementSystem();
}
async function addNewStudent() {
    const student = await inquirer.prompt([
        {
            type: "input",
            name: 'name',
            message: "Enter your name"
        },
        {
            type: "number",
            name: 'age',
            message: "Enter your age"
        }
    ]);
    if (!student.name || !student.age || student.age <= 0) {
        console.log('Invalid response! Try again.');
        addNewStudent();
    }
    else {
        const rollNumber = Math.floor(Math.random() * 90000) + 10000;
        const id = generateUniqueId();
        students[id] = new Student(id, student.name, student.age, rollNumber, []);
        startStudentManagementSystem();
    }
}
function viewInstructors() {
    Object.keys(instructors).length ? console.table(instructors) : console.log('No Instructors.');
    startStudentManagementSystem();
}
async function addNewInstructor() {
    const instructor = await inquirer.prompt([
        {
            type: "input",
            name: 'name',
            message: "Enter your name"
        },
        {
            type: "number",
            name: 'age',
            message: "Enter your age"
        },
        {
            type: "number",
            name: 'salary',
            message: "Enter salary"
        }
    ]);
    if (!instructor.name || !instructor.age || instructor.age <= 0 || !instructor.salary || instructor.salary <= 0) {
        console.log('Invalid response! Try again.');
        addNewInstructor();
    }
    else {
        const id = generateUniqueId();
        instructors[id] = new Instructor(id, instructor.name, instructor.age, instructor.salary, []);
        startStudentManagementSystem();
    }
}
function viewCourses() {
    Object.keys(courses).length ? console.table(courses) : console.log('No Courses.');
    startStudentManagementSystem();
}
async function addNewCourse() {
    const course = await inquirer.prompt([
        {
            type: "input",
            name: 'name',
            message: "Enter your Course Name"
        },
        {
            type: "input",
            name: 'instructorId',
            message: "Enter Instructor Id"
        }
    ]);
    if (!course.name) {
        console.log('Invalid response! Try again.');
        addNewCourse();
    }
    else {
        const id = generateUniqueId();
        let instructorFound = false;
        if (course.instructorId && Object.keys(instructors).findIndex(i => i === course.instructorId) >= 0)
            instructorFound = true;
        instructorFound && instructors[course.instructorId].assignCourse(id);
        courses[id] = new Course(id, course.name, [], instructorFound ? course.instructorId : '');
        startStudentManagementSystem();
    }
}
function viewDepartments() {
    Object.keys(departments).length ? console.table(departments) : console.log('No Departments.');
    startStudentManagementSystem();
}
async function createNewDepartment() {
    const department = await inquirer.prompt([
        {
            type: "input",
            name: 'name',
            message: "Enter your Course Name"
        }
    ]);
    if (!department.name) {
        console.log('Invalid response! Try again.');
        createNewDepartment();
    }
    else {
        const id = generateUniqueId();
        departments[id] = new Department(id, department.name, []);
        startStudentManagementSystem();
    }
}
async function enrollStudent() {
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'studentId',
            message: 'Enter Student Id'
        },
        {
            type: 'input',
            name: 'courseId',
            message: 'Enter Course Id'
        }
    ]);
    if (!answer.studentId || !answer.courseId) {
        console.log('Invalid response! Try again.');
        enrollStudent();
    }
    else {
        let studentFound = false;
        let courseFound = false;
        if (answer.studentId && Object.keys(students).findIndex(i => i === answer.studentId) >= 0)
            studentFound = true;
        if (!studentFound) {
            console.log('Invalid Student Id');
            return enrollStudent();
        }
        if (answer.courseId && Object.keys(courses).findIndex(i => i === answer.courseId) >= 0)
            courseFound = true;
        if (!courseFound) {
            console.log('Invalid Course Id');
            return enrollStudent();
        }
        const { studentId, courseId } = answer;
        students[studentId].registerForCourse(courseId);
        courses[courseId].addStudent(studentId);
        startStudentManagementSystem();
    }
}
async function assignCourse() {
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'instructorId',
            message: 'Enter Instructor Id'
        },
        {
            type: 'input',
            name: 'courseId',
            message: 'Enter Course Id'
        }
    ]);
    if (!answer.instructorId || !answer.courseId) {
        console.log('Invalid response! Try again.');
        assignCourse();
    }
    else {
        const { instructorId, courseId } = answer;
        let instructorFound = false;
        let courseFound = false;
        if (instructorId && Object.keys(instructors).findIndex(i => i === instructorId) >= 0)
            instructorFound = true;
        if (!instructorFound) {
            console.log('Invalid Instructor Id');
            return assignCourse();
        }
        if (courseId && Object.keys(courses).findIndex(i => i === courseId) >= 0)
            courseFound = true;
        if (!courseFound) {
            console.log('Invalid Course Id');
            return assignCourse();
        }
        instructors[instructorId].assignCourse(courseId);
        courses[courseId].setInstructor(instructorId);
        startStudentManagementSystem();
    }
}
async function addCourseIntoDepartment() {
    const answer = await inquirer.prompt([
        {
            type: 'input',
            name: 'departmentId',
            message: 'Enter Department Id'
        },
        {
            type: 'input',
            name: 'courseId',
            message: 'Enter Course Id'
        }
    ]);
    if (!answer.departmentId || !answer.courseId) {
        console.log('Invalid response! Try again.');
        addCourseIntoDepartment();
    }
    else {
        const { departmentId, courseId } = answer;
        let departmentFound = false;
        let courseFound = false;
        if (departmentId && Object.keys(departments).findIndex(i => i === departmentId) >= 0)
            departmentFound = true;
        if (!departmentFound) {
            console.log('Invalid Department Id');
            return addCourseIntoDepartment();
        }
        if (courseId && Object.keys(courses).findIndex(i => i === courseId) >= 0)
            courseFound = true;
        if (!courseFound) {
            console.log('Invalid Course Id');
            return addCourseIntoDepartment();
        }
        departments[departmentId].addCourse(courseId);
        startStudentManagementSystem();
    }
}
async function startStudentManagementSystem() {
    const answer = await inquirer.prompt([
        {
            type: "list",
            name: "action",
            choices: ['Add New Student', 'View Students', 'Add New Instructor', 'View Instructors', 'Add New Course', 'View Courses', 'Create new Department', 'View Departments', 'Enroll Student', 'Assign Course', 'Add Course into Department', 'View Departments', 'Exit']
        }
    ]);
    switch (answer.action) {
        case "Add New Student":
            addNewStudent();
            break;
        case "View Students":
            viewStudents();
            break;
        case "Add New Instructor":
            addNewInstructor();
            break;
        case "View Instructors":
            viewInstructors();
            break;
        case "Add New Course":
            addNewCourse();
            break;
        case "View Courses":
            viewCourses();
            break;
        case "Create new Department":
            createNewDepartment();
            break;
        case "View Departments":
            viewDepartments();
            break;
        case "Enroll Student":
            enrollStudent();
            break;
        case "Assign Course":
            assignCourse();
            break;
        case "Add Course into Department":
            addCourseIntoDepartment();
            break;
        case "Exit":
            break;
        default: {
            console.log('Invalid Action');
            startStudentManagementSystem();
            break;
        }
    }
}
startStudentManagementSystem();
