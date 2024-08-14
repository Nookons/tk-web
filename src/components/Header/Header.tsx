import React, {useState} from 'react';
import {Avatar, Button, Dropdown, Menu, Col, DatePicker, Drawer, Form, Input, Row, Select, Space, message} from "antd";
import {PlusOutlined} from "@ant-design/icons";
import {doc, setDoc} from "firebase/firestore";
import dayjs from "dayjs";
import {db} from "../../firebase";
import {MaskedInput} from "antd-mask-input";
import styles from './Header.module.css';
import {useAppSelector} from "../../hooks/storeHooks";
import {IEmployer} from "../../types/Employer";
import {useNavigate} from "react-router-dom";
import {ADD_SHIFT_ROUTE} from "../../utils/consts";
import logo from '../../assets/logo.jpg'

const {Option} = Select;

const LanguageMenu = (
    <Menu items={[
        {key: '1', label: 'English'},
        {key: '2', label: 'Ukrainian'},
    ]}/>
);

const UserMenu = (
    <Menu items={[
        {key: '1', label: 'Change password'},
        {key: '2', label: 'Log out'},
    ]}/>
);


const MyHeader: React.FC = () => {
    const navigate = useNavigate();
    const user: IEmployer | null = useAppSelector(state => state.currentUser.user);
    const [form] = Form.useForm();
    const [open, setOpen] = useState(false);

    const cellphoneMask = '+48 (000) 000-000';

    const showDrawer = () => setOpen(true);
    const onClose = () => setOpen(false);

    const onSubmitClick = async () => {
        try {
            const values = form.getFieldsValue();
            const body = {
                ...values,
                id: Date.now(),
                birthdayDate: dayjs(values.birthdayDate).valueOf() || "None",
                contractDates: values.contractDates.map((el: any) => dayjs(el).valueOf()) || [],
                residentCardDates: values.residentCardDates?.map((el: any) => dayjs(el).valueOf()) || [],
            };

            const ref = doc(db, 'employers', `${body.id}`);
            await setDoc(ref, body);
            message.success("Successfully added employer");
            form.resetFields();
            onClose();
        } catch (err) {
            err && message.error(`Error: ${err.toString()}`);
        }
    };

    const AdminMenu = (
        <Menu items={[
            {
                key: '1',
                label: (
                    <Button type="primary" onClick={showDrawer} icon={<PlusOutlined/>}>
                        New account
                    </Button>
                ),
            },
            {
                key: '1',
                label: (
                    <Button type="primary" onClick={() => navigate(ADD_SHIFT_ROUTE)} icon={<PlusOutlined/>}>
                        Add Shift
                    </Button>
                ),
            },
        ]}/>
    );

    return (
        <div className={styles.Main}>
            <div className={styles.Logo_body}>
                <Avatar src={logo}/>
            </div>
            <div className={styles.Button_body}>
                <Dropdown overlay={LanguageMenu} placement="bottomRight">
                    <Button>Language</Button>
                </Dropdown>
                <Dropdown overlay={UserMenu} placement="bottomRight">
                    <Button>{user?.firstName} {user?.lastName}</Button>
                </Dropdown>
                <Dropdown overlay={AdminMenu} placement="bottomRight">
                    <Button type="primary">Admin actions</Button>
                </Dropdown>

                <Drawer
                    title="Create a new account"
                    width={720}
                    onClose={onClose}
                    open={open}
                    bodyStyle={{paddingBottom: 80}}
                    extra={
                        <Space>
                            <Button onClick={onClose}>Cancel</Button>
                            <Button onClick={onSubmitClick} type="primary">Submit</Button>
                        </Space>
                    }
                >
                    <Form layout="vertical" hideRequiredMark form={form}>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="firstName"
                                    label="First Name"
                                    rules={[{required: true, message: 'Please enter first name'}]}
                                >
                                    <Input placeholder="Please enter first name"/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="lastName"
                                    label="Last Name"
                                    rules={[{required: true, message: 'Please enter last name'}]}
                                >
                                    <Input placeholder="Please enter last name"/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="position"
                                    label="Position"
                                    rules={[{required: true, message: 'Please select a position'}]}
                                >
                                    <Select placeholder="Please select position">
                                        <Option value="Leader">Leader</Option>
                                        <Option value="Worker">Worker</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="phone"
                                    label="Phone number"
                                    rules={[{required: true, message: 'Please input phone number'}]}
                                >
                                    <MaskedInput mask={cellphoneMask}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="residentCard"
                                    label="Resident card status"
                                    rules={[{required: true, message: 'Please choose the resident card status'}]}
                                >
                                    <Select placeholder="Please choose the status">
                                        <Option value={true}>Yes</Option>
                                        <Option value={false}>No</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="residentCardDates"
                                    label="From | To resident card valid"
                                    dependencies={['residentCard']}
                                    rules={[
                                        ({getFieldValue}) => ({
                                            validator(_, value) {
                                                if (getFieldValue('residentCard') && !value) {
                                                    return Promise.reject(new Error('Please choose the validity period'));
                                                }
                                                return Promise.resolve();
                                            },
                                        }),
                                    ]}
                                >
                                    <DatePicker.RangePicker style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                        </Row>
                        <Row gutter={16}>
                            <Col span={12}>
                                <Form.Item
                                    name="driverLicense"
                                    label="Driver license"
                                    rules={[{required: true, message: 'Please choose the driver license status'}]}
                                >
                                    <Select placeholder="Please choose the status">
                                        <Option value={true}>Yes</Option>
                                        <Option value={false}>No</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="scissorLiftLicense"
                                    label="Scissor Lift License"
                                    rules={[{required: true, message: 'Please choose the scissor lift license status'}]}
                                >
                                    <Select placeholder="Please choose the status">
                                        <Option value={true}>Yes</Option>
                                        <Option value={false}>No</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="forkLiftLicense"
                                    label="Fork Lift License"
                                    rules={[{required: true, message: 'Please choose the fork lift license status'}]}
                                >
                                    <Select placeholder="Please choose the status">
                                        <Option value={true}>Yes</Option>
                                        <Option value={false}>No</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="businessTrip"
                                    label="Business Trip"
                                    rules={[{required: true, message: 'Please choose the business trip status'}]}
                                >
                                    <Select placeholder="Please choose the status">
                                        <Option value={true}>Yes</Option>
                                        <Option value={false}>No</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="country"
                                    label="Country"
                                    rules={[{required: true, message: 'Please choose the country'}]}
                                >
                                    <Select placeholder="Please choose the country">
                                        <Option value="Ukraine">🇺🇦 Ukraine</Option>
                                        <Option value="Belarus">🇧🇾 Belarus</Option>
                                        <Option value="China">🇨🇳 China</Option>
                                    </Select>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="contractDates"
                                    label="Employer contract dates"
                                    rules={[{required: true, message: 'Please choose the contract dates'}]}
                                >
                                    <DatePicker.RangePicker style={{width: '100%'}}/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="birthdayDate"
                                    label="Birthday date"
                                >
                                    <DatePicker style={{width: "100%"}}/>
                                </Form.Item>
                            </Col>
                            <Col span={12}>
                                <Form.Item
                                    name="address"
                                    label="Address"
                                >
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
