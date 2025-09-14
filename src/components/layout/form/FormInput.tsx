interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
    className   ?: string;
    type         : "text" | "number" | "email" | "password" | "date" | "datetime-local" | "color";
    value       ?: string | undefined | number;
}

export const FormInput: React.FC<IProps> = ( props : IProps ) => {
    const { className, type, value, ...rest } = props;
    return (
        <input type={type} className={`form-control ${className}`} value={value ?? ''} {...rest} />
    );
};