import React, { useState } from 'react';
import {Button, Col, Divider, Drawer, Form, Input, message, Row, Space} from 'antd';
import styles from './SignIn.module.css'
import { doc, getDoc } from "firebase/firestore";
import {db} from "../../firebase";
import {useDispatch} from "react-redux";
import {userEnter} from "../../store/reducers/User";
import {useAppSelector} from "../../hooks/storeHooks";



const SignIn: React.FC = () => {
    const dispatch = useDispatch();
    const [form] = Form.useForm();
    const isCurrentUser = useAppSelector(state => state.currentUser.status)


    const onLoginClick = async () => {
        const values = form.getFieldsValue();

        try {
            const docRef = doc(db, "user_accounts", values.username);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                if (docSnap.data().password === values.password) {
                    dispatch(userEnter(docSnap.data().user_id))
                    message.success(`Success enter like ${values.username}`)
                }
            } else {
                message.error("No such document!");
            }
        } catch (err) {
            err && message.error(err.toString());
        }
    }


    return (
        <div className={!isCurrentUser ? styles.Main : ''}>
            <Drawer
                width={620}
                open={!isCurrentUser}
                bodyStyle={{
                    paddingBottom: 80,
                }}
                extra={
                    <Space>
                        <Button onClick={onLoginClick} type="primary">
                            Sign In
                        </Button>
                    </Space>
                }
            >
                <Form layout="vertical" hideRequiredMark form={form}>
                    <Row gutter={16}>
                        <Col span={24}>
                            <h6>Please input you're data for login below</h6>
                            <Divider/>
                        </Col>
                    </Row>
                    <Row gutter={16}>
                        <Col span={12}>
                            <Form.Item
                                name="username"
                                label="Username"
                                rules={[{ required: true, message: <p style={{fontSize: 14}}>Username can't be empty</p> }]}
                            >
                                <Input
                                    style={{ width: "100%" }}
                                    type="text"
                                    placeholder="Please enter user name"
                                />
                            </Form.Item>
                        </Col>
                        <Col span={12}>
                            <Form.Item
                                name="password"
                                label="Password"
                                rules={[{ required: true, message: <p style={{fontSize: 14}}>Password can't be empty</p> }]}
                            >
                                <Input
                                    type="password"
                                    placeholder="Please enter your password"
                                />
                            </Form.Item>
                        </Col>
                    </Row>
                </Form>
            </Drawer>
        </div>
    );
};

export default SignIn;
