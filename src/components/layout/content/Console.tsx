import React from 'react';
import classNames from 'classnames';
import type { MarginSize, Variant } from '../types';
import { Card } from './Card';
import { NavLink, useLocation } from 'react-router-dom';


interface IProps extends React.HTMLAttributes<HTMLDivElement> {
    variant     ?: Variant | 'link';
    margin      ?: MarginSize;
}

interface IHeaderProps extends React.HTMLAttributes<HTMLDivElement> {
    title       ?: string;
    tabs        ?: ConsoleTab[]
}

const navLinkClass = ( { isActive } : { isActive: boolean } ) => classNames('nav-link', isActive && 'active');

export type ConsoleTab = {
    title        : string;
    to           : string;
    end         ?: boolean;
    subTabs     ?: ConsoleTab[];
    activeOnly  ?: boolean;

}

export const Console: React.FC<IProps> & {
    Header  : React.FC<IHeaderProps>;
    Search  : React.FC<React.HTMLAttributes<HTMLDivElement>>;
    Body    : React.FC<React.HTMLAttributes<HTMLDivElement>>;
    Footer  : React.FC<React.HTMLAttributes<HTMLDivElement>>;
} = (props) => {
    const { className, children, ...rest } = props;

    return (
        <Card className={classNames('console', className)} {...rest}>
            {children}
        </Card>
    );
};

Console.Header = ( props : IHeaderProps) => {
    const { title, tabs, children, ...rest } = props;

    return (
        <Card.Header {...rest}>
            {(title || children) && <Card.Title className="console-header">{title && <h5>{title}</h5>}{children}</Card.Title>}
            {tabs && (
                <ul className='nav nav-tabs card-header-tabs' data-bs-tabs="tabs">
                    {tabs.map( ( tab, index ) => {
                        const location = useLocation();
                        const display  = !tab.activeOnly || (location.pathname == tab.to);
                        const path     = tab.activeOnly ? location.pathname : tab.to;

                        return !display ? null : <li key={index} className="nav-item">
                        <NavLink className={navLinkClass} to={path} end={tab.end}>
                            {tab.title}
                        </NavLink>
                        </li>
                    })}
                </ul>
            )}
        </Card.Header>
    );
};

Console.Search = (props) => {
    const { className, children, ...rest } = props;

    return (
        <Card.Body className={classNames('console-search', className)} {...rest}>
            {children}
        </Card.Body>
    );
};

Console.Body = (props) => {
    const { className, children, ...rest } = props;

    return (
        <Card.Body className={classNames('console-body', className)} {...rest}>
            {children}
        </Card.Body>
    );
};

Console.Footer = (props) => {
    const { className, children, ...rest } = props;

    return (
        <Card.Footer className={classNames('console-footer', className)} {...rest}>
            {children}
        </Card.Footer>
    );
};