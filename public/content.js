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