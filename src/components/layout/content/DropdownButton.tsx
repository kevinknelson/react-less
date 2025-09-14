import React from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import type { InputSize, MarginSize, Variant } from '../types';


interface IProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    buttonText   : string;
    variant     ?: Variant | 'link';
    inputSize   ?: InputSize;
    margin      ?: MarginSize;
}

interface ILinkProps extends React.ComponentProps<typeof Link> {
    className   ?: string;
    children     : React.ReactNode;
}

export const DropdownButton : React.FC<IProps> & {
    Link    : React.FC<ILinkProps>;
    Divider : React.FC;
} = (props) => {
    const { buttonText, className, children, ...rest } = props;
    const classes = classNames('dropdown-toggle', className);

    return (
        <div className='dropdown'>
            <Button className={classes} data-bs-toggle="dropdown" aria-expanded="false" {...rest}>{buttonText}</Button>
            <ul className='dropdown-menu'>
                {children}
            </ul>
        </div>
    );
};

DropdownButton.Link = (props: ILinkProps) => {
    const { className, children, ...rest } = props;

    return (
        <li>
            <Link className={classNames('dropdown-item', className)} {...rest}>
                {children}
            </Link>
        </li>
    );
};

DropdownButton.Divider = () => {
    return <hr className="dropdown-divider" />;
};