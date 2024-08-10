import React, {useState, useCallback, useEffect} from 'react';
import styles from './Header.module.css';
import logo from '../../assets/logo.jpg';
import {Avatar, Button, Dropdown, Menu, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message} from "antd";
import { PlusOutlined } from "@ant-design/icons";
import { IEmployer } from "../../types/Employer";
import {db} from "../../firebase";
import {doc, setDoc} from "firebase/firestore";
import dayjs from "dayjs";

const { Option } = Select;

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
    const [open, setOpen] = useState(false);

    const [newEmployerData, setNewEmployerData] = useState<IEmployer>({
        id: 0,
        address: '',
        birthdayDate: 0,
        businessTrip: false,
        contractDates: [],
        forkLiftLicense: false,
        country: "",
        driverLicense: false,
        firstName: "",
        lastName: "",
        phone: 0,
        position: "",
        residentCard: false,
        residentCardDates: [],
        scissorLiftLicense: false,
    });

    const showDrawer = () => {
        setOpen(true);
    };

    const onClose = () => {
        setOpen(false);
    };

    const onUserDataInput = useCallback((type: string, value: any) => {
        setNewEmployerData((prevData) => ({
            ...prevData,
            [type]: value.target ? value.target.value : value,
        }));
    }, []);

    const onSubmitClick = async () => {
        const body = {
            ...newEmployerData,
            id: Date.now(),
            birthdayDate: dayjs(newEmployerData.birthdayDate).valueOf(),
            contractDates: newEmployerData.contractDates.map(el => dayjs(el).valueOf()),
            residentCardDates: newEmployerData.residentCardDates.map(el => dayjs(el).valueOf()),
        };

        try {
            const ref = doc(db, 'employers', `${body.firstName.trim().toLowerCase()}-${body.lastName.trim().toLowerCase()}`);
            await setDoc(ref, { ...body });
            message.success("Successfully added employer");

            setNewEmployerData({
                id: 0,
                address: '',
                birthdayDate: 0,
                businessTrip: false,
                contractDates: [],
                forkLiftLicense: false,
                country: "",
                driverLicense: false,
                firstName: "",
                lastName: "",
                phone: 0,
                position: "",
                residentCard: false,
                residentCardDates: [],
                scissorLiftLicense: false,
            })
        } catch (err) {
            err && message.error(err.toString());
        }

        console.log(body);
    };


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
                <Button type="primary" onClick={showDrawer} icon={<PlusOutlined />}>
                    New account
                </Button>

                <Drawer
                    title="Create a new account"
                    width={720}
                    onClose={onClose}
                    open={open}
                    bodyStyle={{ paddingBottom: 80 }}
                    extra={
                        <Space>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button onClick={onSubmitClick} type="primary">
                                Submit
                            </Button>
                        </Space>
                    }
                >
                    <Form layout="vertical" hideRequiredMark>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="firstName"
                                    label="First Name"
                                    rules={[{ required: true, message: 'Please enter first name' }]}
                                >
                                    <Input
                                        value={newEmployerData.firstName}
                                        onChange={(event) => onUserDataInput("firstName", event)}
                                        placeholder="Please enter first name"
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="lastName"
                                    label="Last Name"
                                    rules={[{ required: true, message: 'Please enter last name' }]}
                                >
                                    <Input
                                        value={newEmployerData.lastName}
                                        onChange={(event) => onUserDataInput("lastName", event)}
                                        placeholder="Please enter last name"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="position"
                                    label="Position"
                                    rules={[{ required: true, message: 'Please select a position' }]}
                                >
                                    <Select
                                        value={newEmployerData.position}
                                        onChange={(value) => onUserDataInput("position", value)}
                                        placeholder="Please select position"
                                    >
                                        <Option value="Leader">Leader</Option>
                                        <Option value="Worker">Worker</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="phone"
                                    label="Phone Number"
                                    rules={[{ required: true, message: 'Please enter phone number' }]}
                                >
                                    <Input
                                        value={newEmployerData.phone}
                                        onChange={(event) => onUserDataInput("phone", event)}
                                        type="text"
                                        addonBefore="+48"
                                        placeholder="Please enter phone number"
                                    />
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={newEmployerData.residentCard ? 12 : 24}>
                                <Form.Item
                                    name="residentCard"
                                    label="Resident card status"
                                    rules={[{ required: true, message: 'Please choose the resident card status' }]}
                                >
                                    <Select
                                        value={newEmployerData.residentCard}
                                        onChange={(value) => onUserDataInput("residentCard", value)}
                                        placeholder="Please choose the status"
                                    >
                                        <Option value={true}>Yes</Option>
                                        <Option value={false}>No</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            {newEmployerData.residentCard &&
                                <Col span={12}>
                                    <Form.Item
                                        name="residentCardValidity"
                                        label="From | To resident card valid"
                                        rules={[{ required: true, message: 'Please choose the validity period' }]}
                                    >
                                        <DatePicker.RangePicker
                                            style={{ width: '100%' }}
                                            getPopupContainer={(trigger) => trigger.parentElement!}
                                            onChange={(dates) => onUserDataInput("residentCardDates", dates)}
                                        />
                                    </Form.Item>
                                </Col>
                            }
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="driverLicense"
                                    label="Driver license"
                                    rules={[{ required: true, message: 'Please choose the driver license status' }]}
                                >
                                    <Select
                                        value={newEmployerData.driverLicense}
                                        onChange={(value) => onUserDataInput("driverLicense", value)}
                                        placeholder="Please choose the status"
                                    >
                                        <Option value={true}>Yes</Option>
                                        <Option value={false}>No</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="scissorLiftLicense"
                                    label="Scissor Lift License"
                                    rules={[{ required: true, message: 'Please choose the scissor lift license status' }]}
                                >
                                    <Select
                                        value={newEmployerData.scissorLiftLicense}
                                        onChange={(value) => onUserDataInput("scissorLiftLicense", value)}
                                        placeholder="Please choose the status"
                                    >
                                        <Option value={true}>Yes</Option>
                                        <Option value={false}>No</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="forkLiftLicense"
                                    label="Fork Lift License"
                                    rules={[{ required: true, message: 'Please choose the scissor lift license status' }]}
                                >
                                    <Select
                                        value={newEmployerData.forkLiftLicense}
                                        onChange={(value) => onUserDataInput("forkLiftLicense", value)}
                                        placeholder="Please choose the status"
                                    >
                                        <Option value={true}>Yes</Option>
                                        <Option value={false}>No</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="businessTrip"
                                    label="Business Trip"
                                    rules={[{ required: true, message: 'Please choose the business trip status' }]}
                                >
                                    <Select
                                        value={newEmployerData.businessTrip}
                                        onChange={(value) => onUserDataInput("businessTrip", value)}
                                        placeholder="Please choose the status"
                                    >
                                        <Option value={true}>Yes</Option>
                                        <Option value={false}>No</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="country"
                                    label="Country"
                                    rules={[{ required: true, message: 'Please choose the country' }]}
                                >
                                    <Select
                                        value={newEmployerData.country}
                                        onChange={(value) => onUserDataInput("country", value)}
                                        placeholder="Please choose the status"
                                    >
                                        <Option value="Ukraine">🇺🇦 Ukraine</Option>
                                        <Option value="Belarus">🇧🇾 Belarus</Option>
                                        <Option value="Chines">🇨🇳 Chines</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="contractDates"
                                    label="Employer contract dates"
                                    rules={[{ required: true, message: 'Please choose the contract dates' }]}
                                >
                                    <DatePicker.RangePicker
                                        style={{ width: '100%' }}
                                        getPopupContainer={(trigger) => trigger.parentElement!}
                                        onChange={(dates) => onUserDataInput("contractDates", dates)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Birthday date"
                                    name="birthdayDate"
                                >
                                    <DatePicker
                                        style={{ width: "100%" }}
                                        onChange={(date) => onUserDataInput("birthdayDate", date)}
                                    />
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    label="Address"
                                    name="address"
                                >
                                    <Input
                                        value={newEmployerData.country}
                                        onChange={(event) => onUserDataInput("address", event)}
                                    />
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
