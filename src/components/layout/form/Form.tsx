import React from 'react';
import classNames from 'classnames';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
    className  ?: string;
    children    : React.ReactNode;
}

type FormType = React.FC<React.HTMLAttributes<HTMLFormElement>> & {
    Header  : React.FC<IProps>;
    Body    : React.FC<IProps>;
    Actions : React.FC<IProps>;
    Footer  : React.FC<IProps>;
};

export const Form: FormType = ( props: React.HTMLAttributes<HTMLFormElement> ) => {
    const { children, className, ...rest } = props;

    return (
        <form className={classNames('card', className)} {...rest}>
            {children}
        </form>
    );
};

Form.Header = (props: IProps) => {
    const { className, children, ...rest } = props;

    return (
        <div className={classNames('card-header', className)} {...rest}>
            <h5 className="card-title">{children}</h5>
        </div>
    );
};

Form.Body = (props: IProps) => {
    const { className, children, ...rest } = props;

    return (
        <div className={classNames('card-body', className)} {...rest}>
            {children}
        </div>
    );
};

Form.Actions = (props: IProps) => {
    const { className, children, ...rest } = props;

    return (
        <div className={classNames('card-footer', 'text-end', className)} {...rest}>
            {children}
        </div>
    );
};

Form.Footer = (props: IProps) => {
    const { className, children, ...rest } = props;

    return (
        <div className={classNames('card-footer', className)} {...rest}>
            {children}
        </div>
    );
};