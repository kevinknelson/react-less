import classNames from 'classnames';
import { type Variant } from '@/components/layout/types';

interface IProps extends React.HTMLAttributes<HTMLSpanElement> {
    variant?: Variant;
    children: React.ReactNode;
}

export const Badge: React.FC<IProps> = (props : IProps) => {
    const { variant, className, children, ...rest } = props;
    const badgeClass = variant ? `text-bg-${variant}` : '';

    return (
        <span className={classNames('badge', badgeClass, className)} {...rest}>
            {children}
        </span>
    );
};