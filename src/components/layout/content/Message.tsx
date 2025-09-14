import React from 'react';
import classNames from 'classnames';
import type { Variant } from '@/components/layout/types';

interface IProps {
    variant     ?: Variant;
    dismissible ?: boolean;
    onClose     ?: () => void;
    children     : React.ReactNode;
}

export const Message: React.FC<IProps> = (props) => {
    const { variant = 'primary', dismissible = false, onClose, children, ...rest } = props;

    const alertClasses = classNames('alert', `alert-${variant}`, {
        'alert-dismissible': dismissible,
    });

    return (
        <div className={alertClasses} role="alert" {...rest}>
            {children}
            {dismissible && (
                <button
                    type="button"
                    className="btn-close"
                    aria-label="Close"
                    onClick={onClose}
                ></button>
            )}
        </div>
    );
};