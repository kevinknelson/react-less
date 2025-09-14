import React from 'react';
import classNames from 'classnames';

interface IProps {
    className    ?: string;
    isResponsive ?: boolean;
    isStriped    ?: boolean;
    isSticky     ?: boolean;
    caption       : string;
    children      : React.ReactNode;
}

export const Table = ( props : IProps ) => {
    const { className, isResponsive, isStriped, isSticky, caption, children, ...rest } = props;
    const classes = classNames('table', className,
        {
            'table-responsive'  : isResponsive,
            'table-striped'     : isStriped,
            'table-sticky'      : isSticky,
        }
    );
    return (
        <table className={classes} {...rest}>
            <caption>{caption}</caption>
            {children}
        </table>
    );
};
