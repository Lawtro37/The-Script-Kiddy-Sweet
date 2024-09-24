function generateTree(obj, level = 0, maxDepth = 2) {
    let html = '';
    for (let key in obj) {
        if (Object.prototype.hasOwnProperty.call(obj, key)) {
            let value = obj[key];
            let type = typeof value;
            if (type === 'object' && value !== null) {
                if (level < maxDepth) {
                    html += `<li><span class="caret" data-key="${key}" data-level="${level}">${key}</span>`;
                    html += generateTree(value, level + 1, maxDepth); // Recursively generate child nodes
                    html += `</li>`;
                } else {
                    html += `<li><span class="caret" data-key="${key}" data-level="${level}">${key}</span><ul class="nested"></ul></li>`;
                }
            } else {
                html += `<li>${key}: <input type="text" value="${value}" data-key="${key}" data-level="${level}" /></li>`;
            }
        }
    }
    return html;
}

function loadChildNodes(element, obj, key, level) {
    let childObj = obj[key];
    let childHtml = generateTree(childObj, level + 1, level + 2); // Load two more layers
    element.innerHTML = childHtml;

    // Add event listeners to the new caret elements
    let newTogglers = element.querySelectorAll('.caret');
    newTogglers.forEach((newElement) => {
        newElement.addEventListener('click', function() {
            let nested = this.parentElement.querySelector('.nested');
            if (nested) {
                if (nested.innerHTML === '') {
                    loadChildNodes(nested, childObj, this.dataset.key, parseInt(this.dataset.level));
                }
                nested.classList.toggle('active');
                this.classList.toggle('caret-down');
            }
        });
    });

    // Add event listeners to the input fields to allow modification of values
    let inputs = element.querySelectorAll('input');
    inputs.forEach((input) => {
        input.addEventListener('change', function() {
            let key = this.dataset.key;
            let newValue = this.value;
            try {
                obj[key] = JSON.parse(newValue);
            } catch (e) {
                obj[key] = newValue;
            }
        });
    });
}

function createVarListWindow() {
    let varListWindowHtml = `
        ${generateTree(window)}
    `;

    let varWindow = new ThemedWindow(600, 100, 400, 600, true, true, true, true, true, 'Variable Hierarchy', varListWindowHtml);

    // Add event listeners to toggle the visibility of child elements
    let toggler = varWindow.element.querySelectorAll('.caret');
    toggler.forEach((element) => {
        element.addEventListener('click', function() {
            let nested = this.parentElement.querySelector('.nested');
            if (nested) {
                if (nested.innerHTML === '') {
                    loadChildNodes(nested, window, this.dataset.key, parseInt(this.dataset.level));
                }
                nested.classList.toggle('active');
                this.classList.toggle('caret-down');
            }
        });
    });

    // Add event listeners to the input fields to allow modification of values
    let inputs = varWindow.element.querySelectorAll('input');
    inputs.forEach((input) => {
        input.addEventListener('change', function() {
            let key = this.dataset.key;
            let newValue = this.value;
            try {
                window[key] = JSON.parse(newValue);
            } catch (e) {
                window[key] = newValue;
            }
        });
    });
}