import {
    parse,
    format,
    isValid,
    startOfDay,
    endOfDay,
    startOfMonth,
    endOfMonth,
    startOfYear,
    endOfYear,
    addDays,
    addMonths,
    addYears,
    addHours,
    addMinutes,
    addSeconds
} from "date-fns";

export class DateTimeString {
    private _date: Date | null;
    private _format: string;

    private static otherFormats = [
        "yyyy-MM-dd HH:mm", // without seconds
        "yyyy-MM-dd"        // date only
    ];

    static fromForm(value: string, allowNull: boolean = true): DateTimeString | null {
        const date = new Date(value);
        return new DateTimeString(date, "yyyy-MM-dd HH:mm:ss", allowNull);
    }

    constructor(value: string | Date | DateTimeString | undefined | null, format: string = "yyyy-MM-dd HH:mm:ss", isNullable: boolean = true) {
        this._date      = null;
        this._format    = format;

        if( value instanceof DateTimeString ) {
            this._date = value.asDate();
        }
        else if (value instanceof Date) {
            this._date = isValid(value) ? value : null;
        }
        else if (typeof value === "string") {
            this._loadFromString(value, format, isNullable);
        }
        else {
            if (!isNullable) {
                throw new Error("A DateTimeString, identified as not-nullable, was provided a null value.");
            }
        }

        if (this._date == null && !isNullable) {
            throw new Error("A DateTimeString, identified as not-nullable, was provided a value that resulted in null.");
        }
    }

    isValidDate(): boolean {
        return !!this._date && isValid(this._date);
    }

    toString(): string | null {
        return this.toFormat(this._format);
    }

    toFormat(formatString: string = "yyyy-MM-dd HH:mm:ss"): string | null {
        return this._date ? format(this._date, formatString) : null;
    }

    asDate(): Date | null {
        return this._date;
    }

    startOfDay(): DateTimeString {
        return this._date ? new DateTimeString(startOfDay(this._date), this._format) : this;
    }

    endOfDay(): DateTimeString {
        return this._date ? new DateTimeString(endOfDay(this._date), this._format) : this;
    }

    startOfMonth(): DateTimeString {
        return this._date ? new DateTimeString(startOfMonth(this._date), this._format) : this;
    }

    endOfMonth(): DateTimeString {
        return this._date ? new DateTimeString(endOfMonth(this._date), this._format) : this;
    }

    startOfYear(): DateTimeString {
        return this._date ? new DateTimeString(startOfYear(this._date), this._format) : this;
    }

    endOfYear(): DateTimeString {
        return this._date ? new DateTimeString(endOfYear(this._date), this._format) : this;
    }

    addDays(n: number): DateTimeString {
        return this._date ? new DateTimeString(addDays(this._date, n), this._format) : this;
    }

    addMonths(n: number): DateTimeString {
        return this._date ? new DateTimeString(addMonths(this._date, n), this._format) : this;
    }

    addYears(n: number): DateTimeString {
        return this._date ? new DateTimeString(addYears(this._date, n), this._format) : this;
    }

    addHours(n: number): DateTimeString {
        return this._date ? new DateTimeString(addHours(this._date, n), this._format) : this;
    }

    addMinutes(n: number): DateTimeString {
        return this._date ? new DateTimeString(addMinutes(this._date, n), this._format) : this;
    }

    addSeconds(n: number): DateTimeString {
        return this._date ? new DateTimeString(addSeconds(this._date, n), this._format) : this;
    }

    static now(format: string = "yyyy-MM-dd HH:mm:ss"): DateTimeString {
        return new DateTimeString(new Date(), format);
    }

    static today(format: string = "yyyy-MM-dd"): DateTimeString {
        return new DateTimeString(startOfDay(new Date()), format);
    }

    private _loadFromString(value: string, formatStr: string, isNullable: boolean): void {
        const raw: string | null = typeof value === "string" ? (value.trim() || null) : null;

        if (raw == null) {
            if (!isNullable) {
                throw new Error("Non-nullable DateTimeString received an empty string.");
            }
            this._date = null;
            return;
        }

        let parsed: Date | null = parse(raw, formatStr, new Date());
        if (!isValid(parsed)) {
            parsed = null;
            for (const fmt of DateTimeString.otherFormats) {
                const attempt = parse(raw, fmt, new Date());
                if (isValid(attempt)) {
                    parsed = attempt;
                    break;
                }
            }
        }

        this._date = parsed && isValid(parsed) ? parsed : null;
    }
}
