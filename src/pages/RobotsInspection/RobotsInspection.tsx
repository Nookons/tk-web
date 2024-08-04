import React, {useEffect, useState} from 'react';
import {
    Button,
    DatePicker,
    DatePickerProps, Divider,
    Form,
    GetProps,
    Input,
    message,
    RadioChangeEvent,
    Switch,
    Upload,
    UploadProps
} from "antd";
import Radio from "antd/es/radio";
import {PlusOutlined, UploadOutlined} from "@ant-design/icons";
import dayjs from "dayjs";
import {db} from "../../firebase";
import { doc, setDoc } from "firebase/firestore";
import RobotsList from "./RobotsList";

type OTPProps = GetProps<typeof Input.OTP>;

const props: UploadProps = {
    name: 'file',
    action: 'https://660d2bd96ddfa2943b33731c.mockapi.io/api/upload',
    headers: {
        authorization: 'authorization-text',
    },
    onChange(info) {
        if (info.file.status !== 'uploading') {
            console.log(info.file, info.fileList);
        }
        if (info.file.status === 'done') {
            message.success(`${info.file.name} file uploaded successfully`);
        } else if (info.file.status === 'error') {
            message.error(`${info.file.name} file upload failed.`);
        }
    },
};

const RobotsInspection = () => {

    const [robot_id, setRobot_id] = useState<number>(0);
    const [conditionValue, setConditionValue] = useState<string>("");
    const [checkDate, setCheckDate] = useState<number>(0);

    const onChange: OTPProps['onChange'] = (text) => {
        setRobot_id(Number(text));
    };

    const sharedProps: OTPProps = {
        onChange,
    };

    const onChangeRadio = (e: RadioChangeEvent) => {
        setConditionValue(e.target.value)
    };

    const onDateChange: DatePickerProps['onChange'] = (date, dateString) => {
        const timeStamp = dayjs(date).valueOf();
        setCheckDate(timeStamp);
    }

    const onSaveClick = async () => {
        if (robot_id <= 1) {
            message.error("You don't have any robot id");
            return
        }
        if (conditionValue.length < 1) {
            message.error("You don't have any condition value");
            return
        }
        if (checkDate <= 1) {
            message.error("You don't have any Date");
            return
        }

        message.info("Okay, here we try to upload you data")

        try {
            await setDoc(doc(db, "robots_check", robot_id.toString()), {
                robot_id: robot_id,
                date: checkDate,
                condition: conditionValue
            });
            message.success("Robot data was save")
        } catch (err) {
            err && message.error(err.toString());
        }
    }


    return (
        <div>
            <Form style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 14,
                justifyContent: "space-between",
            }}>
                <Form.Item label="Robot ID" name="input">
                    <Input.OTP length={7} formatter={(str) => str.toUpperCase()} {...sharedProps} />
                </Form.Item>
                <Form.Item label="Check date" name="datepicker">
                    <DatePicker onChange={onDateChange}/>
                </Form.Item>
                <Radio.Group value={conditionValue} onChange={onChangeRadio} buttonStyle="solid">
                    <Radio.Button value="good">Good</Radio.Button>
                    <Radio.Button value="bad">Bad</Radio.Button>
                </Radio.Group>
                {conditionValue === "bad" &&
                    <Form.Item
                        style={{minWidth: "50%"}}
                        label="Please load picture of problems"
                        name="upload"
                        valuePropName="fileList"
                        getValueFromEvent={(e) => e.fileList} // Ensures that fileList is properly handled
                    >
                        <Upload {...props}>
                            <Button icon={<UploadOutlined/>}>Click to Upload</Button>
                        </Upload>
                    </Form.Item>
                }
                <Button onClick={onSaveClick} type={"primary"}>Save</Button>
            </Form>
            <Divider>Robots List</Divider>
            <RobotsList />
        </div>
    );
};

export default RobotsInspection;