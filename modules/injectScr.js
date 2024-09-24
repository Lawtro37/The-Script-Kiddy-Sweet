
new ThemedWindow(100, 100, 600, 500, true, true, true, true, true, 'Script Injector', `
    <textarea id="scriptText" style="width: 100%; height: 200px;"></textarea>
    <button id="injectScript">Inject</button>
`);
document.getElementById('Inject Script').addEventListener('click', () => {
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
