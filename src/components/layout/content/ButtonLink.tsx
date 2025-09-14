import React from 'react';
import { Link } from 'react-router-dom';
import classNames from 'classnames';
import type { InputSize, Variant } from '@/components/layout/types';

interface IProps extends React.ComponentProps<typeof Link> {
    variant     ?: Variant;
    inputSize   ?: InputSize;
    className   ?: string;
}

export const ButtonLink: React.FC<IProps> = (props : IProps) => {
    const { variant = 'primary', inputSize: size, className, children, ...rest } = props;

    const btnClass = classNames(
        'btn',
        `btn-${variant}`,
        size && `btn-${size}`,
        className
    );

    return (
        <Link className={btnClass} {...rest}>
            {children}
        </Link>
    );
};