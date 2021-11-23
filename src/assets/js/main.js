(function() {
    const copyBtn = document.getElementById('copyBtn');
    const copyText = document.getElementById('code-snippet');
    const liveRegion = document.getElementById('copy-update');
    copyBtn.removeAttribute('hidden');

    copyBtn.onclick = () => {
        copyText.select();
        document.execCommand('copy');
        liveRegion.innerHTML = "Installation code copied to clipboard."
        this.focus();
    }
})();
