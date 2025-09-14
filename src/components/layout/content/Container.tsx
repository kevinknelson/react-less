import React from 'react';
import classNames from 'classnames';

interface IProps {
    fluid      ?: boolean;
    className  ?: string;
    children    : React.ReactNode;
}

export const Container = ( props : IProps ) => {
    return (
        <div className={classNames(props.fluid ? 'container-fluid' : 'container', props.className)}>
            {props.children}
        </div>
    );
};
