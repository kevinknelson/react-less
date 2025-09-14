import classNames from 'classnames';

interface IProps extends React.HTMLAttributes<HTMLElement> {
    name: string; // The name of the Bootstrap icon (e.g., "alarm", "bell").
    size?: 'sm' | 'lg'; // Optional size modifiers.
}

export const Glyph: React.FC<IProps> = (props : IProps) => {
    const { name, size, className, ...rest } = props;
    const iconClass = classNames(`bi-${name}`, className, {
        [`bi-${size}`]: size,
    });

    return <i className={iconClass} {...rest}></i>;
};