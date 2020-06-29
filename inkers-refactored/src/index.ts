import * as _ from 'lodash';

// function component() {
//     const element = document.createElement('div');

//     element.innerHTML = _.join(['Hello', 'webpack'], ' ');

//     return element;
// }

// document.body.appendChild(component());


function getName(name: String) {
    throw new Error("test")
    return name;
}

console.log(getName('krunal'));