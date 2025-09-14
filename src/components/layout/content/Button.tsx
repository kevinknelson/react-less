import React from 'react';
import classNames from 'classnames';
import type { InputSize, MarginSize, Variant } from '../types';


interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    variant     ?: Variant | 'link';
    inputSize   ?: InputSize;
    margin      ?: MarginSize;
}

export const Button = (props: IProps) => {
    const { variant = 'primary', inputSize: size, className, ...rest } = props;

    const btnClass = classNames(
        'btn',
        `btn-${variant}`,
        size && `btn-${size}`,
        props.margin && `m-${props.margin}`,
        className
    );

    return <button className={btnClass} {...rest} />;
};
