(function() {
const copyBtn = document.getElementById('copyBtn')
    const copyText = document.getElementById('code-snippet')
    copyBtn.removeAttribute('hidden');

    copyBtn.onclick = () => {
        copyText.select(); // Selects the text inside the input
        document.execCommand('copy'); // Simply copies the selected text to clipboard
    }
})();
