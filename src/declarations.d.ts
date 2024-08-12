declare module '*.module.css' {
    const classes: { [key: string]: string };
    export default classes;
}

declare module '*.jpg' {
    const value: string;
    export default value;
}

declare module 'react-input-mask' {
    import * as React from 'react';
    import { InputProps } from 'antd/lib/input';

    interface InputMaskProps extends InputProps {
        mask: string;
        alwaysShowMask?: boolean;
    }

    export default class InputMask extends React.Component<InputMaskProps> {}
}

