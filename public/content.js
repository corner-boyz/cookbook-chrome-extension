/* global chrome */

window.addEventListener('mouseup', () => {
    let selectedText = window.getSelection().toString().trim();
    let ingredients = parseToArray(selectedText);
    console.log(ingredients);
    if (ingredients.length) {
        let message = {
          ingredients: ingredients
        };
        chrome.runtime.sendMessage(message);
    }
});

const parseToArray = (string) => {
    let arr = string.split(/\n/);
    arr.forEach((str, index) => {
        // Take out unnecesary text
        let cutOffs = [ str.indexOf(','), str.indexOf('(') ];
        cutOffs.forEach(index => {
            if (index > 5) {
                str = str.substring(0, index);
            } else if (index > 0 && str.includes('can')) {
                str = convertFromCan(str);
            }
        });
        arr[index] = str.trim();
        // Check for empty strings
        if (!str.replace(/\s/g,'').length) {
            arr[index] = undefined;
        }
    });
    // Remove empty strings
    arr = arr.filter(el => el !== undefined);
    return arr;
}

const convertFromCan = (str) => {
    let realUnits = str.substring(str.indexOf('(') + 1, str.indexOf(')'));
    return realUnits + str.substring(str.indexOf('can') + 3);
}