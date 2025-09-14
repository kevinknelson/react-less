import React from 'react';
import classNames from 'classnames';
import type { MarginSize } from '../types';

interface IProps {
    className      ?: string;
    margin         ?: MarginSize;
    gutterSize     ?: number;
    gutterSizeX    ?: number;
    gutterSizeY    ?: number;
    colsAuto       ?: boolean;
    colsXs         ?: number;
    colsSm         ?: number;
    colsMd         ?: number;
    colsLg         ?: number;
    colsXl         ?: number;
    justifyContent ?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly';
    children        : React.ReactNode;
}

export const Row = ( props : IProps ) => {
    const rowClasses = classNames(
        'row',
        props.margin && `m-${props.margin}`,
        props.gutterSize && `g-${props.gutterSize}`,
        props.gutterSizeX && `gx-${props.gutterSizeX}`,
        props.gutterSizeY && `gy-${props.gutterSizeY}`,
        props.colsAuto && 'row-cols-auto',
        props.colsXs != null && `row-cols-${props.colsXs}`,
        props.colsSm != null && `row-cols-sm-${props.colsSm}`,
        props.colsMd != null && `row-cols-md-${props.colsMd}`,
        props.colsLg != null && `row-cols-lg-${props.colsLg}`,
        props.colsXl != null && `row-cols-xl-${props.colsXl}`,
        props.justifyContent && `justify-content-${props.justifyContent}`,
        props.className
    );
    return <div className={rowClasses}>{props.children}</div>;
};