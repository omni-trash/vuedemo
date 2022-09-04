import { format as _format } from 'date-fns';

function formatDate(date: Date|string, format: string = "dd.MM.yyyy"): string {
    try {
        if (date) {
            // date-fns dont support strings anymore
            if (typeof date == "string") {
                date = new Date(date);
            }

            return _format(date, format);
        }
    
        return "-";
    } catch (error) {
        return `${error}`;
    }
}

// async promise helper
function delay(timeout: number = 10): Promise<void> {
    return new Promise<void>(resolve => window.setTimeout(() => resolve(), timeout));
}

function install(app: any, options: any) {
    app.config.globalProperties.$utils = utils;
}

const utils = {
    install,
    formatDate,
    delay,
}

export default utils;
