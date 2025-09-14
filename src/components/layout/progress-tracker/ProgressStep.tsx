import React from 'react';
import classNames from 'classnames';

interface IProps {
    status         ?: 'primary' | 'success' | 'danger' | 'warning' | 'default' | null,
    className      ?: string,
    helpText       ?: string,
    helpTextColor  ?: string | null,
    children        : React.ReactNode,
    onClick        ?: React.MouseEventHandler<HTMLDivElement>; // undefined or function
}

export const ProgressStep = ( props : IProps ) => {
    const colClasses    = classNames(props.status, props.className, props.onClick && 'clickable');
    const helpTextColor = props.helpTextColor || "#000";

    return <div className={colClasses} onClick={props.onClick}>
        <div className='text'>{props.children}</div>
        {props.helpText && <div className='helpText' style={{color:helpTextColor}}>{props.helpText}</div>}
    </div>
};