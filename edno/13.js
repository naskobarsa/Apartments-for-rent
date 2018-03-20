function solve(input) {

    let students=[];
    for (let obj of input) {
        let tokens = obj.split(' -> ');

        let namee = tokens[0];
        let age = Number(tokens[1]);
        let grade = Number(tokens[2]);

        let student = {};

        student.ime = namee;
        student.ages = age;
        student.grades = grade;

        students.push(student);
    }
    for (let obj of students) {
        console.log(`Name: ${obj.ime}`
        );
    }
}

solve(['Pesho -> 17 -> 6.00', 'Gosho -> 22 -> 5.54'])