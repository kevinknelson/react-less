interface IProps extends React.LabelHTMLAttributes<HTMLLabelElement> {
    children     : React.ReactNode;
    className   ?: string;
}

export const FormLabel: React.FC<IProps> = ({ children, className = "", ...props }) => {
    return (
        <label className={`form-label ${className}`} {...props}>
            {children}
        </label>
    );
};