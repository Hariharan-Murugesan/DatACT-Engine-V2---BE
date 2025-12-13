export const adjustMin = (ip: any) => {
    const minutesToMs = (min: any) => min * 60;
    if (ip) {
        if (ip > minutesToMs(3780)) {
            return ip - minutesToMs(3780);
        } else if (ip > minutesToMs(2340)) {
            return ip - minutesToMs(2340);
            return ip - minutesToMs(900);
        } else {
            return ip;
        }
    } else {
        return 0
    }
}

export const adjustSec = (ip: any) => {
    if (ip) {
        if (ip > 3780) {
            return 3780;
        } else if (ip > 2340) {
            return ip - 2340;
        } else if (ip > 900) {
            return ip - 900;
        } else {
            return ip;
        }
    } else {
        return 0
    }
}

export const convertTime = (seconds: number) => {
    try {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        const formattedMin = minutes.toString().padStart(2, '0');
        const formattedSec = remainingSeconds.toString().padStart(2, '0') === '00' ? remainingSeconds.toString().padStart(2, '0') : (Math.ceil(Number(remainingSeconds))).toString().padStart(2, '0');

        return `${formattedMin}:${formattedSec}`;
    } catch (error) {
        return '0';
    }
}

export const convertTimeHours = (seconds: number) => {
    try {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        const formattedMin = minutes.toString().padStart(2, '0');
        const formattedSec = remainingSeconds.toString().padStart(2, '0') === '00' ? remainingSeconds.toString().padStart(2, '0') : (Math.ceil(Number(remainingSeconds))).toString().padStart(2, '0');

        return `${formattedMin}`;
    } catch (error) {
        return '0';
    }
}

export const convertTimeDot = (seconds: number) => {
    try {
        const minutes = Math.floor(seconds / 60);
        const remainingSeconds = seconds % 60;

        const formattedMin = minutes.toString().padStart(2, '0');
        const formattedSec = remainingSeconds.toString().padStart(2, '0') === '00' ? remainingSeconds.toString().padStart(2, '0') : (Math.ceil(Number(remainingSeconds))).toString().padStart(2, '0');

        return `${formattedMin}.${formattedSec}`;
    } catch (error) {
        return '0';
    }
}

export const tableFormatJson = (data: any) => {
    try {
        const formatFieldName = (key) => {
            return key
                .replace(/_/g, " ").toUpperCase();
        };

        const entries = Object.entries(data).map(([key, value]) => ({
            fieldName: formatFieldName(key),
            fieldValue: value !== null ? value : "N/A"
        }));

        const ROWS = 5;
        const COLS = Math.ceil(entries.length / ROWS);
        const table: any = [];

        for (let i = 0; i < ROWS; i++) {
            const row = {};
            for (let j = 0; j < COLS; j++) {
                const entryIndex = i + j * ROWS;
                if (entries[entryIndex]) {
                    row[`FIELD ${j + 1}`] = entries[entryIndex].fieldName;
                    row[`VALUE ${j + 1}`] = entries[entryIndex].fieldValue;
                }
            }
            table.push(row);
        }
        return table;
    } catch (error: any) {
        console.log("tableFormatJson", error.message)
        return []
    }
}