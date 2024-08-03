import React from 'react';
import styles from './Header.module.css';
import logo from '../../assets/logo.jpg';
import { Avatar, Button, Dropdown, Menu } from "antd";

const items_lang = [
    {
        key: '1',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                English
            </a>
        ),
    },
    {
        key: '2',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                Ukrainian
            </a>
        ),
    },
];
const items_user = [
    {
        key: '1',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.antgroup.com">
                Change password
            </a>
        ),
    },
    {
        key: '2',
        label: (
            <a target="_blank" rel="noopener noreferrer" href="https://www.aliyun.com">
                Log out
            </a>
        ),
    },
];

const Language_menu = (
    <Menu items={items_lang} />
);
const User_menu = (
    <Menu items={items_user} />
);

const MyHeader = () => {
    return (
        <div className={styles.Main}>
            <div className={styles.Logo_body}>
                <Avatar src={logo} />
            </div>
            <div className={styles.Button_body}>
                <Dropdown overlay={Language_menu} placement="bottomRight">
                    <Button>Language</Button>
                </Dropdown>
                <Dropdown overlay={User_menu} placement="bottomRight">
                    <Button>TEMP_001</Button>
                </Dropdown>
            </div>
        </div>
    );
};

export default MyHeader;
