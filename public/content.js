/* global chrome */

window.addEventListener('mouseup', () => {
    let selectedText = window.getSelection().toString().trim();
    console.log(parseToArray(selectedText));
    //   if (selectedText.length > 0) {
    //     let message = {
    //       text: selectedText
    //     };
    //     chrome.runtime.sendMessage(message);
    //   }
});

const parseToArray = string => {
    let arr = string.split(/\n/);
    arr.forEach((str, index) => {
        // Take out unnecesary text
        let cutOffs = [ str.indexOf(','), str.indexOf('(') ];
        cutOffs.forEach(index => {
            if (index !== -1) {
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