import classNames from "classnames";
import type { InputSize } from "../types";

interface IProps extends React.InputHTMLAttributes<HTMLInputElement> {
    name         : string; // Ensure name is required for form identification
    value        : number | string; // Ensure value is required for external control
    className   ?: string;
    sliderText  ?: string;
    inputSize   ?: InputSize
}

export const FormRangeInput: React.FC<IProps> = ( props : IProps ) => {
    const {  name, value, className = "", sliderText, inputSize, ...rest } = props;
    const divClasses = classNames("input-group", "range", "align-items-center", inputSize && `btn-${inputSize}`,);

    return (
        <div className={divClasses}>
            {sliderText && <span className="input-group-text">{sliderText}</span>}
            <div className="form-control">
                <input
                    name={name}
                    type="range"
                    className={`form-range ${className}`}
                    value={value ?? ''}
                    {...rest}
                />
            </div>
            <span className="input-group-text" style={{minWidth: '55px'}}>{value}</span>
        </div>
    );
};