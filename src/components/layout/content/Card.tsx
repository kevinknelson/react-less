import classNames from 'classnames';

interface IProps extends React.HTMLAttributes<HTMLDivElement> {
    className ?: string;
    children   : React.ReactNode;
}

interface IImgProps extends React.ImgHTMLAttributes<HTMLImageElement> {
    className ?: string;
    location  ?: string;
    alt        : string;
}

export const Card : React.FC<IProps> & {
    Header  : React.FC<IProps>;
    Title   : React.FC<IProps>;
    Body    : React.FC<IProps>;
    Text    : React.FC<IProps>;
    Image   : React.FC<IImgProps>;
    Link    : React.FC<React.AnchorHTMLAttributes<HTMLAnchorElement>>;
    Footer  : React.FC<IProps>;
} = (props : IProps) => {
    const { className, children, ...rest } = props;
    return (
        <div className={classNames('card', className)} {...rest}>
            {children}
        </div>
    );
};

Card.Header = (props : IProps) => {
    const { className, children, ...rest } = props;
    return (
        <div className={classNames('card-header', className)} {...rest}>
            {children}
        </div>
    );
};

Card.Title = (props : IProps) => {
    const { className, children, ...rest } = props;
    return (
        <div className={classNames('card-title', className)} {...rest}>
            {children}
        </div>
    );
};

Card.Body = (props : IProps) => {
    const { className, children, ...rest } = props;
    return (
        <div className={classNames('card-body', className)} {...rest}>
            {children}
        </div>
    );
};

Card.Text = (props : IProps) => {
    const { className, children, ...rest } = props;
    return (
        <p className={classNames('card-text', className)} {...rest}>
            {children}
        </p>
    );
};

Card.Image = (props : IImgProps) => {
    const { className, location = "top", alt, ...rest } = props;
    const imageClass = `card-img-${location}`;
    return <img className={classNames(imageClass, className)} alt={alt} {...rest} />;
};

Card.Link = (props : React.AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const { className, children, ...rest } = props;
    return (
        <a className={classNames('card-link', className)} {...rest}>
            {children}
        </a>
    );
};

Card.Footer = (props : IProps) => {
    const { className, children, ...rest } = props;
    return (
        <div className={classNames('card-footer', className)} {...rest}>
            {children}
        </div>
    );
};