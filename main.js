
    
    //forEach, find, fillter, some, every, reduce
    //forEach
    Array.prototype.forEach2 = function(callback) {
        for(var index in this) {
            if(this.hasOwnProperty(index)) {
                callback(this[index], index, this)
            }
        }
    }

    var courses = [
        'Javascript',
        'PHP',
        'Ruby'
    ];

    courses.forEach2(function(course, index, array) {
        console.log(course, index, array);
    });

    //Find

    var cour = [
        {
            name: 'Javascript',
            coin: 680
        },
        {
            name: 'PHP',
            coin: 780
        },
        {
            name: 'Ruby',
            coin: 880
        }
    ];
    Array.prototype.filter2 = function(callback) {
        var output = [];

        for(var index in this) {
            if(this.hasOwnProperty(index)) {
              var result = callback(this[index], index, this)
              if(result) {
                  output.push(this[index])
              }
            }
        }
        return output;
    }


    var fillterCour = cour.filter2(function(course, index, array) {
        console.log(course, index, array)
        return course.name === 'PHP';
    })

    console.log(fillterCour)

    //Some()

    Array.prototype.some2 = function(callback) {
        var output = false;
        for(var index in this) {
            if(this.hasOwnProperty(index)) {
                if(callback(this[index], index, this)) {
                    return output = true;
                    break;
                }
            }
        }
        return false;
    }

    var cours = [
        {
            name: 'Javascript',
            coin: 680,
            isFinish: true,
        },
        {
            name: 'Javascript',
            coin: 680,
            isFinish: false,
        },
        {
            name: 'Javascript',
            coin: 680,
            isFinish: false
        },
    ];

    var fillterCours = cours.some2(function(cours, index, array) {
        console.log(cours, index, array)
        return cours.isFinish;
    })

    console.log(fillterCours)

    //Every()

    Array.prototype.every2 = function(callback) {
        var output = false;
        for(var index in this) {
            if(this.hasOwnProperty(index)) {
                var result = callback(this[index], index, this)
                if(!result) {
                    return output = false;
                    break;
                }
            }
        }
        return true;
    }

    var cours = [
        {
            name: 'Javascript',
            coin: 680,
            isFinish: true,
        },
        {
            name: 'Javascript',
            coin: 780,
            isFinish: false,
        },
        {
            name: 'Javascript',
            coin: 880,
            isFinish: true
        },
    ];

    var fillterCours = cours.every2(function(cours, index, array) {
        console.log(cours, index, array)
        return cours.coin > 680;
    })

    console.log(fillterCours)

    //Map()

    
    Array.prototype.map2 = function(callback) {
        var output = [];
        var arrayLeangth =  this.length;
        for(var i = 0; i < this.length; i++) {
            var result = callback(this[i], i);
            output.push(result);
        }
        return output;
    }
    
    var courses = [
        'Javascript',
        'PHP',
        'Ruby'
    ];

    var htmls = courses.map2(function(course) {
        return `<h2>${course}</h2>`
    });

    console.log(htmls.join(''))

    




