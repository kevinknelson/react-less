import classNames from 'classnames';

interface IProps {
    xs         ?: number;
    sm         ?: number;
    md         ?: number;
    lg         ?: number;
    xl         ?: number;
    xxl        ?: number;
    className  ?: string;
    children    : React.ReactNode;
}

export const Col = ( props : IProps ) => {
    const hasSizeProps = props.xs || props.sm || props.md || props.lg || props.xl || props.xxl;

    const colClasses = classNames(
        !hasSizeProps && 'col', // fallback class if no sizes passed
        props.xs != null && `col-${props.xs}`,
        props.sm != null && `col-sm-${props.sm}`,
        props.md != null && `col-md-${props.md}`,
        props.lg != null && `col-lg-${props.lg}`,
        props.xl != null && `col-xl-${props.xl}`,
        props.xxl != null && `col-xxl-${props.xxl}`,
        props.className
    );

    return <div className={colClasses}>{props.children}</div>;
};