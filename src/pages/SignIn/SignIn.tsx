import React, { useState } from 'react';
import { Button, Col, Drawer, Form, Input, message, Space } from 'antd';



const SignIn: React.FC = () => {
    const [open, setOpen] = useState(true);

    const [isUser, setIsUser] = useState<boolean>(true);

    const [userData, setUserData] = useState({
        user_name: "",
        password: ""
    });

    const onSubmit = () => {
        if (userData.user_name === "geekplus" && userData.password === "77778888") {
            setIsUser(true); // Should correctly toggle the state
        } else {
            message.error("Something went wrong!");
        }
    };

    return (
        <Drawer
            width={320}
            open={!isUser}
            bodyStyle={{
                paddingBottom: 80,
            }}
            extra={
                <Space>
                    <Button onClick={onSubmit} type="primary">
                        Sign In
                    </Button>
                </Space>
            }
        >
            <Form layout="vertical" hideRequiredMark>
                <Col span={24}>
                    <Form.Item
                        name="Username"
                        label="Username"
                        rules={[{ required: true, message: "Username can't be empty" }]}
                    >
                        <Input
                            style={{ width: "100%" }}
                            type="text"
                            placeholder="Please enter user name"
                            onChange={(event) => setUserData((prev) => ({ ...prev, user_name: event.target.value }))}
                        />
                    </Form.Item>
                </Col>
                <Col span={24}>
                    <Form.Item
                        name="Password"
                        label="Password"
                        rules={[{ required: true, message: "Password can't be empty" }]}
                    >
                        <Input
                            type="password"
                            placeholder="Please enter your password"
                            onChange={(event) => setUserData((prev) => ({ ...prev, password: event.target.value }))}
                        />
                    </Form.Item>
                </Col>
            </Form>
        </Drawer>
    );
};

export default SignIn;
