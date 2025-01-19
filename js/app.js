// Status manager
const statusSpinner = document.querySelector(`#repackStatus div`);
const statusMsg = document.querySelector(`#repackStatus span`);

function setBusyState(state) {
    let c = 'collapse';
    (state) ? statusSpinner.classList.remove(c) : statusSpinner.classList.add(c);
}

function setStatusMsg(msg) {
    statusMsg.textContent = msg;
}

// Enable popovers
const popoverTriggerList = document.querySelectorAll('[data-bs-toggle="popover"]')
const popoverList = [...popoverTriggerList].map(popoverTriggerEl => new bootstrap.Popover(popoverTriggerEl))

// Functions
function copyTableToClipboard(caller, tableId) {
    let table = document.getElementById(tableId);
    let rows = table.rows;
    let text = '';
    for (let i = 0; i < rows.length; i++) {
        let cells = rows[i].cells;
        for (let j = 0; j < cells.length; j++) {
            text += cells[j].innerText + '\t';
        }
        text += '\n';
    }
    copyToClipboard(caller, text);
}

function copyInputToClipboard(caller, itemId) {
    const text = document.getElementById(itemId).value;
    copyToClipboard(caller, text);
}

function copyToClipboard(caller, text) {
    navigator.clipboard.writeText(text).then(function() {
        console.log('Content copied to clipboard successfully.');
        const popoverId = caller.getAttribute('aria-describedby');
        document.querySelector(`#${popoverId} .popover-body`).textContent = "Copied!";
        const icon = caller.querySelector('i');
        const iconClassList = [...icon.classList];
        icon.classList = 'bi bi-check-lg';
        // Hide the popover after 2 seconds
        setTimeout(function() {
            icon.classList = iconClassList.join(" ");
        }, 2000);
        }, function(err) {
            console.error('Error copying content to clipboard: ', err);
        }
    );
}

// Initialize
window.addEventListener('DOMContentLoaded', async () => {
    document.getElementById('pakInput').addEventListener('change', validatePaks);
    await loadManifestConfig();
    await loadQuestConfig();
});