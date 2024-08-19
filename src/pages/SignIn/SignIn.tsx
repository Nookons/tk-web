import React, { useEffect, useState } from 'react';
import { Button, Col, Divider, Drawer, Form, Input, message, Row, Space, Checkbox, Spin } from 'antd';
import { useDispatch } from 'react-redux';
import { userEnter } from '../../store/reducers/User';
import { useAppSelector } from '../../hooks/storeHooks';
import { doc, getDoc } from 'firebase/firestore';
import dayjs from 'dayjs';
import { IEmployer } from '../../types/Employer';
import { db } from '../../firebase';
import styles from './SignIn.module.css';
import {MaskedInput} from "antd-mask-input";

const SignIn: React.FC = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const isCurrentUser = useAppSelector(state => state.currentUser.status);
    const [loading, setLoading] = useState(false);

    const cellphoneMask = '+48 (000) 000-000';

    useEffect(() => {
        const autoLogin = async () => {
            const local_data = localStorage.getItem("login_data");

            if (local_data) {
                try {
                    const parsedData = JSON.parse(local_data);
                    const current_time = dayjs().valueOf();
                    const isCan = dayjs(current_time).isBefore(parsedData.check_time);

                    if (isCan) {
                        message.success("Used auto login");
                        dispatch(userEnter(parsedData.user as IEmployer));
                    } else {
                        message.info("Auto login time expired, please sign in again");
                    }
                } catch (err) {
                    message.error("Failed to process auto-login data");
                }
            }
        };

        autoLogin();
    }, [dispatch]);

    const getUser = async (data: any) => {
        setLoading(true);

        try {
            const docRef = doc(db, "user_accounts", data.username.replace(/[+\-()\s]/g, ""));
            const docSnap = await getDoc(docRef);

            console.log(docSnap.data());

            if (!docSnap.exists()) {
                message.error("No such document!");
                return;
            }

            if (docSnap.data()?.password !== data.password) {
                message.error("Invalid credentials!");
                return;
            }

            const fullUserPath = doc(db, "employers", docSnap.data().id.toString());
            const fullUserSnap = await getDoc(fullUserPath);

            if (!fullUserSnap.exists()) {
                message.error("User data not found!");
                return;
            }

            const userData = {
                check_time: dayjs().add(1, 'hour').valueOf(),
                username: data.username,
                user: fullUserSnap.data(),
                id: docSnap.data().user_id
            };

            dispatch(userEnter(fullUserSnap.data() as IEmployer));
            if (data.isLogin) {
                localStorage.setItem("login_data", JSON.stringify(userData));
            }

            message.success(`Successfully logged in as ${data.username}`);
        } catch (err) {
            err && message.error(`Login failed: ${err.toString()}`);
        } finally {
            setLoading(false);
        }
    };

    const onLoginClick = () => {
        form.validateFields().then(values => {
            getUser(values);
        }).catch(errorInfo => {
            errorInfo && message.error("Please fill all required fields");
        });
    };

    return (
        <div className={!isCurrentUser ? styles.Main : ''}>
            <Drawer
                width={620}
                open={!isCurrentUser}
                bodyStyle={{ paddingBottom: 80 }}
                extra={
                    <Space>
                        <Button onClick={onLoginClick} type="primary" disabled={loading}>
                            {loading ? <Spin size="small" /> : "Sign In"}
                        </Button>
                    </Space>
                }
            >
                <Form layout="horizontal" hideRequiredMark form={form}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <Form.Item
                                name="username"
                                label="Phone Number"
                                rules={[{ required: true, message: "Username can't be empty" }]}
                            >
                                <MaskedInput
                                    mask={cellphoneMask}
                                />
                            </Form.Item>
                        </Col>
                        <Col span={24}>
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[{ required: true, message: "Password can't be empty" }]}
                            >
                                <Input
                                    type="password"
                                    placeholder="Please enter your password"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item name="isLogin" valuePropName="checked">
                                <Checkbox>Keep me logged in</Checkbox>
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </div>
    );
};

export default SignIn;
