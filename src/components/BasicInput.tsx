import {ChangeEvent} from "react";


interface BasicInputProps {
    type?: string;
    placeholder?: string;
    value: string|number;
    onChange: (e: ChangeEvent<HTMLInputElement>) => void;
    required?: boolean;
}


const BasicInput : React.FC<BasicInputProps> = ({type, placeholder, value, required, onChange}) => {
    return (
        <input
            type={type}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            required={required}
        />
    );
}

export default BasicInput;