import React from 'react';
import type { ReactNode } from 'react';
import classNames from 'classnames';

interface IProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
    name         : string;
    value        : string | number;
    onChange     : (e: React.ChangeEvent<HTMLSelectElement>) => void;
    className   ?: string;
    disabled    ?: boolean;
    required    ?: boolean;
    options     ?: Array<{ value: string | number; label: string }>;
    children    ?: ReactNode; // Allow children for custom options / optgroup / etc.
    placeholder ?: string | null; // Allow null to explicitly disable placeholder
}

export const FormSelect: React.FC<IProps> = ( props : IProps ) => {
    const { name, value, onChange, className, disabled = false, required = false, options, children, placeholder = "Please Select" } = props;
    const selectClasses = classNames('form-select', className);

    // Developer warning if both children and options are provided
    if( children && options ) {
        console.warn('[FormSelect] Both `children` and `options` are defined. `children` will take precedence.');
    }
    if( !children && !options ) {
        console.warn('[FormSelect] Neither `children` nor `options` are defined. The select will have no options.');
    }

    return (
        <select
            name={name}
            value={value}
            onChange={onChange}
            className={selectClasses}
            disabled={disabled}
            required={required}
        >
            {placeholder && <option value="">{placeholder}</option>}
            {children ||
                (options &&
                    options.map((option) => (
                        <option key={option.value} value={option.value}>
                            {option.label}
                        </option>
                    )))}
        </select>
    );
};