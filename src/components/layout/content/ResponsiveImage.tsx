import type { ImgHTMLAttributes } from 'react';
import classNames from "classnames";

interface IProps extends ImgHTMLAttributes<HTMLImageElement> {
    alt: string; //force to be required
}

export const ResponsiveImage = ( props : IProps ) => {
    const { className, alt, ...rest } = props;
    const finalClassName = classNames('img-fluid', className);

    return <img className={finalClassName} alt={alt} {...rest} />;
};