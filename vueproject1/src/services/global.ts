let blockerCounter: number = 0;

// show a blocker to prevent user interaction
function showBlocker(): void {
    ++blockerCounter;

    const element: HTMLElement | null = document.getElementById("blocker");

    if (element) {
        element.style.display = "block";
    }
}

// hide the blocker to allow user interaction
function hideBlocker(): void {
    --blockerCounter;

    if (blockerCounter !== 0) {
        // blocker in use
        return;
    }

    const element: HTMLElement | null = document.getElementById("blocker");

    if (element) {
        element.style.display = "none";
    }
}

// adds an error alert
function alertError(message: any): HTMLElement | null {
    const alerts: HTMLElement | null = document.querySelector('#alert-container');

    if (!alerts) {
        console.log("alertError failed, no alert-container");
        return null;
    }

    const alert: HTMLElement = document.createElement('div');

    alert.innerHTML = `
    <div class="alert alert-danger rounded-0 my-0 alert-dismissible">
        <div class="container">
            <h2 class="alert-heading">Fehler</h2>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            <p>
                ${message}
            </p>
        </div>
    </div>`;

    alerts.appendChild(alert);
    return alert;
}

// adds an success alert
function alertSuccess(message: any, timeout?: number): HTMLElement | null {
    const alerts: HTMLElement | null = document.querySelector('#alert-container');

    if (!alerts) {
        console.log("alertSuccess failed, no alert-container");
        return null;
    }

    const alert: HTMLElement = document.createElement('div');

    alert.innerHTML = `
    <div class="alert alert-success rounded-0 my-0 alert-dismissible">
        <div class="container">
            <h2 class="alert-heading">Erfolg</h2>
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
            <p>
                ${message}
            </p>
        </div>
    </div>`;

    alerts.appendChild(alert);

    if (timeout) {
        window.setTimeout(() => {
            if (alert.parentNode) {
                alert.parentNode.removeChild(alert);
            }
        }, timeout);
    }

    return alert;
}

// remove all alerts
function clearAlerts(): void {
    const alerts: HTMLElement | null = document.querySelector('#alert-container');

    if (!alerts) {
        console.log("showSuccess failed, no alert-container");
        return;
    }

    alerts.innerHTML = '';
}

export default {
    showBlocker,
    hideBlocker,
    alertError,
    alertSuccess,
    clearAlerts
}
