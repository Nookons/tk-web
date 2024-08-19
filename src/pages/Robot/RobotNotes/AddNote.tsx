import React, {FC, useState} from 'react';
import TextArea from "antd/es/input/TextArea";
import {Divider, Form, Input, message} from "antd";
import {useForm} from "antd/es/form/Form";
import Button from "antd/es/button";
import dayjs from "dayjs";
import {useAppSelector} from "../../../hooks/storeHooks";
import {onRobotAddNote} from "../../../utils/Robot/AddRobotNote";

interface AddNoteProps {
    robot_id: string;
}

const AddNote:FC <AddNoteProps> = ({robot_id}) => {
    const user = useAppSelector(state => state.currentUser.user)
    const [form] = useForm();
    const [isLoading, setIsLoading] = useState<boolean>(false);

    const onFormFinish = async (values: any) => {
        try {
            setIsLoading(true)
            const data = {
                ...values,
                date: dayjs().valueOf(),
                note_id: dayjs().valueOf(),
                username: `${user?.firstName} ${user?.lastName}`,
                user: user && user.id,
            }
            await onRobotAddNote(data, robot_id);
            message.success("Notes was added")
            form.resetFields();
        } catch (err) {
            err && message.error(err.toString())
        } finally {
            setTimeout(() => {
                setIsLoading(false);
            }, 250)
        }
    };

    const onFormFinishFailed = (errorInfo: any) => {
        errorInfo && message.error(errorInfo.toString())
    };

    return (
        <Form
            form={form}
            name="basic"
            layout="vertical"
            initialValues={{remember: true}}
            onFinish={onFormFinish}
            onFinishFailed={onFormFinishFailed}
        >
            <Divider>Leave note here</Divider>
            <Form.Item  label="Please leave some note here" name="body">
                <TextArea rows={2}/>
            </Form.Item>
            <Form.Item>
                <Button loading={isLoading} type="primary" htmlType="submit">
                    Add note
                </Button>
            </Form.Item>
        </Form>
    );
};

export default AddNote;