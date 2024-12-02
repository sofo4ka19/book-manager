import {ChangeEvent, CSSProperties} from "react";


interface BasicInputProps {
    type?: string;
    placeholder?: string;
    value: string|number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
    style?: CSSProperties;
}


const BasicInput : React.FC<BasicInputProps> = ({type, placeholder, value, required, onChange, style}) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
            style={style}
        />
    );
}

export default BasicInput;