//initiating the script

// Function to get a cookie value by name
function getCookie(name) {
    let matches = document.cookie.match(new RegExp(
        "(?:^|; )" + name.replace(/([\.$?*|{}\(\)\[\]\\\/\+^])/g, '\\$1') + "=([^;]*)"
    ));
    return matches ? decodeURIComponent(matches[1]) : undefined;
}

// Function to apply the theme
function applyTheme(theme) {
    // Logic to apply the theme
    console.log(`Applying theme: ${theme}`);
}

// Load settings from cookies
let theme = "light";
try {
    let cookieTheme = getCookie('theme');
    if (cookieTheme) {
        theme = cookieTheme;
    }
    applyTheme(theme);
} catch (e) {
    console.log(e);
    theme = 'light';
    applyTheme(theme);
}

// check if SKS is already loaded
// Function to create a prompt with two options
function showPrompt() {
    // Create the prompt container
    let promptContainer = document.createElement('div');
    promptContainer.style.position = 'fixed';
    promptContainer.style.top = '50%';
    promptContainer.style.left = '50%';
    promptContainer.style.transform = 'translate(-50%, -50%)';
    promptContainer.style.backgroundColor = '#fff';
    promptContainer.style.border = '1px solid #ccc';
    promptContainer.style.padding = '20px';
    promptContainer.style.zIndex = '1000';
    promptContainer.style.boxShadow = '0 0 10px rgba(0, 0, 0, 0.5)';

    // Create the prompt message
    let promptMessage = document.createElement('p');
    promptMessage.style.color = '#000';
    promptMessage.textContent = 'An instance of The Script Kiddy Sweet is already running. By continuing, you will close the current instance and open a new one. Do you want to continue?';
    promptContainer.appendChild(promptMessage);

    // Create the buttons container
    let buttonsContainer = document.createElement('div');
    buttonsContainer.style.display = 'flex';
    buttonsContainer.style.justifyContent = 'space-between';
    promptContainer.appendChild(buttonsContainer);

    // Create the first button
    let button1 = document.createElement('button');
    button1.textContent = 'yes';
    button1.style.marginRight = '10px';
    button1.addEventListener('click', () => {
        killWindows();
        new ThemedWindow(100, 100, 500, 320, true, true, true, true, true, 'Script Kiddy Sweet', mainWindowHtml);
        document.getElementById('varList').addEventListener('click', () => {
            console.log("Creating variable list window");
            createVarListWindow();
        });
        document.getElementById('funcList').addEventListener('click', () => {
            console.log("Creating function list window");
            alert('No functions found');
        });
        document.getElementById('wsSniffer').addEventListener('click', () => {
            createWSSnifferWindow()
        });
        document.getElementById('inject').addEventListener('click', () => {
            injectScript();
        });
        document.getElementById('advLog').addEventListener('click', () => {
            advancedLog();
        });
        document.getElementById('setting').addEventListener('click', () => {
            settings();
        });
        document.body.removeChild(promptContainer);
    });
    buttonsContainer.appendChild(button1);

    // Create the second button
    let button2 = document.createElement('button');
    button2.textContent = 'no';
    button2.addEventListener('click', () => {
        document.body.removeChild(promptContainer);
        throw new Error('Denyed - The Script Kiddy Sweet is already running');
    });
    buttonsContainer.appendChild(button2);

    // Append the prompt container to the body
    document.body.appendChild(promptContainer);
}

// Add some basic styles for the window
const style = document.createElement('style');
style.innerHTML = `
    .window {
        border: 1px solid #000;
        background-color: #fff;
        box-shadow: 0 0 10px rgba(0, 0, 0, 0.5);
        position: fixed; /* Ensure the window is fixed */
        z-index: 1000; /* Ensure the window is above other content */
        display: flex;
        flex-direction: column;
    }
    .title-bar {
        background-color: #ccc;
        padding: 5px;
        cursor: move;
        display: flex;
        justify-content: space-between;
        align-items: center;
        flex-shrink: 0;
    }
    .title-bar-controls button {
        background: none;
        border: none;
        cursor: pointer;
        width: 20px;
        height: 20px;
        margin-left: 5px;
        display: flex;
        align-items: center;
        justify-content: center;
        font-size: 14px;
        font-weight: bold;
    }
    .title-bar-controls button:hover {
        background-color: #aaa;
    }
    .window-body {
        padding: 10px;
        overflow: auto; /* Add scrollbar if content overflows */
        flex-grow: 1; /* Allow the body to grow and take up available space */
    }
    ul, #myUL {
        list-style-type: none;
    }
    li {
        cursor: pointer;
    }
    .caret {
        cursor: pointer;
        user-select: none; /* Prevent text selection */
    }
    .caret::before {
        content: "\\25B6"; /* Right-pointing triangle */
        color: black;
        display: inline-block;
        margin-right: 6px;
    }
    .caret-down::before {
        transform: rotate(90deg); /* Down-pointing triangle */
    }
    .nested {
        display: none;
    }
    .active {
        display: block;
    }
`;
document.head.appendChild(style);

console.log("Page is fully loaded");

let windows = [];
class Window {
    constructor(x, y, width, height, movable, resizable, minimizable, maximizable, closeable, title, content) {
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.movable = movable;
        this.resizable = resizable;
        this.minimizable = minimizable;
        this.maximizable = maximizable;
        this.closeable = closeable;
        this.title = title;
        this.content = content;
        
        this.render();
        if (this.movable) this.move();
        if (this.resizable) this.addResizeHandles();
    }

    render() {
        let window = document.createElement('div');
        window.classList.add('window');
        window.style.left = this.x + 'px';
        window.style.top = this.y + 'px';
        window.style.width = this.width + 'px';
        window.style.height = this.height + 'px';
        window.innerHTML = `
            <div class="title-bar">
                <div class="title-bar-text">${this.title}</div>
                <div class="title-bar-controls">
                    <button aria-label="Minimize">-</button>
                    <button aria-label="Close">x</button>
                </div>
            </div>
            <div class="window-body">
                ${this.content}
            </div>
        `;
        document.body.appendChild(window);
        this.element = window; // Correctly assign this.element

        this.originalHeight = this.height;

        // Add event listeners for the buttons
        this.element.querySelector('button[aria-label="Close"]').addEventListener('click', () => {
            if (this.element.parentNode) {
                this.element.parentNode.removeChild(this.element);
            }
        });
        this.element.querySelector('button[aria-label="Minimize"]').addEventListener('click', () => {
            const windowBody = this.element.querySelector('.window-body');
            if (windowBody.style.display === 'none') {
                windowBody.style.display = 'block';
                this.element.style.height = this.originalHeight + 'px';
            } else {
                windowBody.style.display = 'none';
                this.element.style.height = this.element.querySelector('.title-bar').offsetHeight + 'px';
            }
        });
    }

    move() {
        let titleBar = this.element.querySelector('.title-bar');
        let isDragging = false;
        let offset = {x: 0, y: 0};
        titleBar.addEventListener('mousedown', (e) => {
            isDragging = true;
            offset.x = e.offsetX;
            offset.y = e.offsetY;
            document.body.style.userSelect = 'none'; // Prevent text selection while dragging
        });
        document.addEventListener('mousemove', (e) => {
            if (isDragging) {
                this.x = e.clientX - offset.x;
                this.y = e.clientY - offset.y;
                this.element.style.left = this.x + 'px';
                this.element.style.top = this.y + 'px';
            }
        });
        document.addEventListener('mouseup', () => {
            isDragging = false;
            document.body.style.userSelect = ''; // Re-enable text selection
        });
    }

    addResizeHandles() {
        const handles = ['nw', 'ne', 'sw', 'se', 'n', 's', 'e', 'w'];
        handles.forEach(handle => {
            const resizeHandle = document.createElement('div');
            resizeHandle.classList.add('resize-handle', handle);
            this.element.appendChild(resizeHandle);
            resizeHandle.addEventListener('mousedown', (e) => this.initResize(e, handle));
        });
    }

    initResize(e, handle) {
        e.preventDefault();
        const startX = e.clientX;
        const startY = e.clientY;
        const startWidth = this.element.offsetWidth;
        const startHeight = this.element.offsetHeight;
        const startLeft = this.element.offsetLeft;
        const startTop = this.element.offsetTop;

        const doResize = (e) => {
            if (handle.includes('e')) {
                this.element.style.width = startWidth + (e.clientX - startX) + 'px';
            }
            if (handle.includes('s')) {
                this.element.style.height = startHeight + (e.clientY - startY) + 'px';
            }
            if (handle.includes('w')) {
                this.element.style.width = startWidth - (e.clientX - startX) + 'px';
                this.element.style.left = startLeft + (e.clientX - startX) + 'px';
            }
            if (handle.includes('n')) {
                this.element.style.height = startHeight - (e.clientY - startY) + 'px';
                this.element.style.top = startTop + (e.clientY - startY) + 'px';
            }
        };

        const stopResize = () => {
            document.removeEventListener('mousemove', doResize);
            document.removeEventListener('mouseup', stopResize);
        };

        document.addEventListener('mousemove', doResize);
        document.addEventListener('mouseup', stopResize);
    }
}

// Override the Window class to apply the theme when a new window is created
class ThemedWindow extends Window {
    constructor(x, y, width, height, movable, resizable, minimizable, maximizable, closeable, title, content) {
        super(x, y, width, height, movable, resizable, minimizable, maximizable, closeable, title, content);
        applyTheme(theme); // Apply the current theme to the new window
    }
}

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

let logs = [];

class Message {
    constructor(type, message, timestamp) {
        this.type = type;
        this.message = message;
        this.timestamp = timestamp;
    }
}

function updateAdvancedLog() {
    let logMessages = document.getElementById('logMessages');
    if (logMessages) {
        logMessages.innerHTML = logs.map(log => `<div>[${log.timestamp}] [${log.type}] - ${log.message}</div>`).join('');
    }
}

function advancedLog() {
    const originalLog = console.log; // Store the original console.log function
    const originalError = console.error; // Store the original console.error function
    const originalWarn = console.warn; // Store the original console.warn function
    const originalAlert = alert; // Store the original alert function

    try {
        console.log = function() {
            const messageText = Array.from(arguments).map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
            logs.push(new Message("INFO", messageText, new Date().toLocaleTimeString()));
            originalLog.apply(console, arguments); // Call the original console.log function
            updateAdvancedLog();
        };

        console.error = function() {
            const messageText = Array.from(arguments).map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
            logs.push(new Message("ERROR", messageText, new Date().toLocaleTimeString()));
            originalError.apply(console, arguments); // Call the original console.error function
            updateAdvancedLog();
        };

        console.warn = function() {
            const messageText = Array.from(arguments).map(arg => typeof arg === 'object' ? JSON.stringify(arg) : arg).join(' ');
            logs.push(new Message("WARNING", messageText, new Date().toLocaleTimeString()));
            originalWarn.apply(console, arguments); // Call the original console.warn function
            updateAdvancedLog();
        };

        alert = function(message) {
            logs.push(new Message("ALERT", message, new Date().toLocaleTimeString()));
            originalLog(message); // Call the original console.log function
            updateAdvancedLog();
        }

        let logWindow = new ThemedWindow(100, 100, 800, 700, true, true, true, true, true, 'Advanced Log', `
            <div id="logMessages" style="height: 700px; overflow-y: auto; border: 1px solid #ccc; padding: 10px;">
                ${logs.map(log => `<div>[${log.timestamp}] [${log.type}] - ${log.message}</div>`).join('')}
            </div>
        `);
    } catch (e) {
        console.log = originalLog;
        console.error = originalError;
        console.warn = originalWarn;
        alert = originalAlert;
        console.log(e);
        alert('An error occurred while trying to create the advanced log');
    }
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

let mainWindowHtml = `
    <h1>Welcome to The Script Kiddy Sweet!</h1>
    <p>The Script Kiddy Sweet is a simple set of tools for javascript "hacking"</p>
    <p>Click on the buttons to open the tools</p>
    <button id="varList">Variable Hierarchy</button>
    <button id="inject">Inject Script</button>
    <button id="advLog">Advanced Log</button>
    <br>
    <button id="setting">Settings</button>
    <br>>
    <h4>Version: 0.4.7</h4>
    <h4>Created by: Lawtro</h4>
`;

let wsSnifferHtml = `
    <h1>Web Socket Sniffer</h1>
    <div id="wsMessages" style="height: 200px; overflow-y: auto; border: 1px solid #ccc; padding: 10px;"></div>
`;

class WebSocketSniffer {
    constructor() {
        this.originalWebSocket = window.WebSocket;
        this.init();
    }

    init() {
        const self = this;
        window.WebSocket = function(...args) {
            const ws = new self.originalWebSocket(...args);
            ws.addEventListener('message', (event) => {
                self.logMessage(event.data);
            });
            return ws;
        };
    }

    logMessage(message) {
        const wsMessagesDiv = document.getElementById('wsMessages');
        if (wsMessagesDiv) {
            const messageElement = document.createElement('div');
            messageElement.textContent = message;
            wsMessagesDiv.appendChild(messageElement);
        }
    }
}

function createWSSnifferWindow() {
    let wsSnifferWindow = new ThemedWindow(100, 100, 400, 300, true, true, true, true, true, 'Web Socket Sniffer', wsSnifferHtml);
    new WebSocketSniffer();
}

function injectScript() {
    let SIwindow = new ThemedWindow(100, 100, 600, 500, true, true, true, true, true, 'Script Injector', `
        <textarea id="scriptText" style="width: 100%; height: 200px;"></textarea>
        <button id="injectScript">Inject</button>
    `);
    document.getElementById('injectScript').addEventListener('click', () => {
        let scriptText = document.getElementById('scriptText').value;
        try {
            if(scriptText !== '') {
                let script = document.createElement('script');
                if(scriptText.includes('http')) {
                    script.src = scriptText;
                } else {
                    script.innerHTML = scriptText;
                }
                document.body.appendChild(script);
            }
        } catch (e) {
            document.getElementById('injectScript').parentElement.appendChild(document.createElement('div')).textContent = e;
        }
    });
}



// Add some basic styles for the tree view
const treeStyle = document.createElement('style');
treeStyle.innerHTML = `
    ul, #myUL {
        list-style-type: none;
    }
    li {
        cursor: pointer;
    }
    .caret {
        cursor: pointer;
        user-select: none; /* Prevent text selection */
    }
    .caret::before {
        content: "\\25B6"; /* Right-pointing triangle */
        color: black;
        display: inline-block;
        margin-right: 6px;
    }
    .caret-down::before {
        transform: rotate(90deg); /* Down-pointing triangle */
    }
    .nested {
        display: none;
    }
    .active {
        display: block;
    }
`;
document.head.appendChild(treeStyle);

// Example usage
if (document.querySelector('.window')) {
    showPrompt();
} else {
    new ThemedWindow(100, 100, 500, 320, true, true, true, true, true, 'Script Kiddy Sweet', mainWindowHtml);
    document.getElementById('varList').addEventListener('click', () => {
        console.log("Creating variable list window");
        createVarListWindow();
    });
    document.getElementById('funcList').addEventListener('click', () => {
        console.log("Creating function list window");
        alert('No functions found');
    });
    document.getElementById('wsSniffer').addEventListener('click', () => {
        createWSSnifferWindow();
    });
    document.getElementById('inject').addEventListener('click', () => {
        injectScript();
    });
    document.getElementById('advLog').addEventListener('click', () => {
        advancedLog();
    });
    document.getElementById('setting').addEventListener('click', () => {
        settings();
    });
}

function applyTheme(theme) {
    if (theme === 'dark') {
        document.body.style.backgroundColor = '#333';
        document.body.style.color = '#fff';
        document.body.style.transition = 'all 0.5s';
        // Apply theme to windows
        document.querySelectorAll('.window').forEach(window => {
            window.style.backgroundColor = '#444';
            window.style.color = '#fff';
        });

        document.querySelectorAll('.title-bar').forEach(titleBar => {
            titleBar.style.backgroundColor = '#555';
        });
    } else {
        document.body.style.backgroundColor = '#fff';
        document.body.style.color = '#000';
        document.body.style.transition = 'all 0.5s';
        // Apply theme to windows
        document.querySelectorAll('.window').forEach(window => {
            window.style.backgroundColor = '#f0f0f0';
            window.style.color = '#000';
        });

        document.querySelectorAll('.title-bar').forEach(titleBar => {
            titleBar.style.backgroundColor = '#ccc';
        });
    }
}

function settings() {
    let settingWindow = new ThemedWindow(100, 100, 400, 300, true, true, true, true, true, 'Settings', `
        <h1>Settings</h1>
        <label for="theme">Theme:</label>
        <select id="theme">
            <option value="light">Light</option>
            <option value="dark">Dark</option>
        </select>
    `);
    document.getElementById('theme').addEventListener('change', () => {
        let theme = document.getElementById('theme').value;
        theme = theme === 'dark' ? 'dark' : 'light';
        applyTheme(theme);
        // Save settings using cookies with additional options
        document.cookie = "theme=" + theme + "; path=/; expires=Fri, 31 Dec 9999 23:59:59 GMT; secure; SameSite=Lax";
    });
}

// kill all windows
function killWindows() {
    document.querySelectorAll('.window').forEach(window => {
        window.parentNode.removeChild(window);
    });
}

// kill all windows when ctrl + shift + k is pressed
document.addEventListener('keydown', (e) => {
    if (e.ctrlKey && e.shiftKey && e.key === 'K') {
        killWindows();
    }
});