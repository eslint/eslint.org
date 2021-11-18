(function() {
const copyBtn = document.getElementById('copyBtn')
    const copyText = document.getElementById('code-snippet')
    copyBtn.removeAttribute('hidden');

    copyBtn.onclick = () => {
        copyText.select();
        document.execCommand('copy');
        this.focus();
    }
})();
