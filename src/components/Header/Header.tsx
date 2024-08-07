import React, {useState} from 'react';
import styles from './Header.module.css';
import logo from '../../assets/logo.jpg';
import {Avatar, Button, Dropdown, Menu} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {Col, DatePicker, Drawer, Form, Input, Row, Select, Space} from 'antd';
import {IEmployer} from "../../types/Employer";

const {Option} = Select;

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
    <Menu items={items_lang}/>
);
const User_menu = (
    <Menu items={items_user}/>
);

const MyHeader = () => {
    const [open, setOpen] = useState(false);

    const [newEmployerData, setNewEmployerData] = useState<IEmployer>({
        id: 0,
        address: '',
        birthdayDate: 0,
        businessTrip: false,
        contractFrom: 0,
        contractValidity: 0,
        country: "",
        driverLicense: false,
        firstName: "",
        lastName: "",
        phone: 0,
        position: "",
        residentCard: false,
        residentCardValidity: 0,
        scissorLiftLicense: false,
    });

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const onUserDataInput = (type: string, value: any) => {

    }

    return (
        <div className={styles.Main}>
            <div className={styles.Logo_body}>
                <Avatar src={logo}/>
            </div>
            <div className={styles.Button_body}>
                <Dropdown overlay={Language_menu} placement="bottomRight">
                    <Button>Language</Button>
                </Dropdown>
                <Dropdown overlay={User_menu} placement="bottomRight">
                    <Button>TEMP_001</Button>
                </Dropdown>
                <Button type="primary" onClick={showDrawer} icon={<PlusOutlined/>}>
                    New account
                </Button>

                <Drawer
                    title="Create a new account"
                    width={720}
                    onClose={onClose}
                    open={open}
                    styles={{
                        body: {
                            paddingBottom: 80,
                        },
                    }}
                    extra={
                        <Space>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button onClick={onClose} type="primary">
                                Submit
                            </Button>
                        </Space>
                    }
                >
                    <Form layout="vertical" hideRequiredMark>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label="First Name"
                                    rules={[{required: true, message: 'Please enter user name'}]}
                                >
                                    <Input
                                        onChange={(event) => onUserDataInput("first_name", event)}
                                        placeholder="Please enter user name"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label="Last Name"
                                    rules={[{required: true, message: 'Please enter user name'}]}
                                >
                                    <Input
                                        onChange={(event) => onUserDataInput("last_name", event)}
                                        placeholder="Please enter user name"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="owner"
                                    label="Position"
                                    rules={[{required: true, message: 'Please select an owner'}]}
                                >
                                    <Select
                                        onChange={(event) => onUserDataInput("position", event)}
                                        placeholder="Please select positon"
                                    >
                                        <Option value="xiao">Leader</Option>
                                        <Option value="mao">Worker</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="name"
                                    label="Phone Number"
                                    rules={[{required: true, message: 'Please enter phone number'}]}
                                >
                                    <Input type={"Number"} addonBefore={"+48"} placeholder="Please enter phone number"/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="approver"
                                    label="Resident card status"
                                    rules={[{required: true, message: 'Please choose the approver'}]}
                                >
                                    <Select placeholder="Please choose the approver">
                                        <Option value="jack">Yes</Option>
                                        <Option value="tom">No</Option>
                                        <Option value="tom">In progress</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="dateTime"
                                    label="From | To resident card valid"
                                    rules={[{required: true, message: 'Please choose the dateTime'}]}
                                >
                                    <DatePicker.RangePicker
                                        style={{width: '100%'}}
                                        getPopupContainer={(trigger) => trigger.parentElement!}
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="approver"
                                    label="Driver licesnse"
                                    rules={[{required: true, message: 'Please choose the approver'}]}
                                >
                                    <Select placeholder="Please choose the approver">
                                        <Option value="yes">Yes</Option>
                                        <Option value="no">No</Option>
                                        <Option value="in progress">In progress</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="approver"
                                    label="Scissor Lift License"
                                    rules={[{required: true, message: 'Please choose the approver'}]}
                                >
                                    <Select placeholder="Please choose the approver">
                                        <Option value="yes">Yes</Option>
                                        <Option value="no">No</Option>
                                        <Option value="in progress">In progress</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="approver"
                                    label="Business Trip"
                                    rules={[{required: true, message: 'Please choose the Business Trip status'}]}
                                >
                                    <Select placeholder="Please choose the approver">
                                        <Option value="yes">Yes</Option>
                                        <Option value="no">No</Option>
                                        <Option value="in progress">In progress</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="dateTime"
                                    label="Employer contract dates"
                                    rules={[{required: true, message: 'Please choose the dateTime'}]}
                                >
                                    <DatePicker.RangePicker
                                        style={{width: '100%'}}
                                        getPopupContainer={(trigger) => trigger.parentElement!}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item  label="Birthday date" name="datepicker">
                                    <DatePicker style={{width: "100%"}}/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item label="Adrress" name="input">
                                    <Input/>
                                </Form.Item>
                            </Col>
                        </Row>
                    </Form>
                </Drawer>
            </div>
        </div>
    );
};

export default MyHeader;
