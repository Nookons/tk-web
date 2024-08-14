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
import {doc, setDoc, arrayUnion, updateDoc} from "firebase/firestore";
import RobotsList from "./RobotsList";
import {useAppDispatch, useAppSelector} from "../../hooks/storeHooks";
import {addRobot, removeRobot} from "../../store/reducers/Robots";

type OTPProps = GetProps<typeof Input.OTP>;


const RobotsInspection = () => {
    const dispatch = useAppDispatch();
    const robots_data = useAppSelector(state => state.robots.items)
    const [robot_id, setRobot_id] = useState<number>(0);
    const [conditionValue, setConditionValue] = useState<string>("");
    const [noteValue, setNoteValue] = useState("");

    const onChange: OTPProps['onChange'] = (text) => {
        setRobot_id(Number(text));
    };

    const sharedProps: OTPProps = {
        onChange,
    };

    const onChangeRadio = (e: RadioChangeEvent) => {
        setConditionValue(e.target.value)
    };

    const onSaveClick = async () => {
        if (!robot_id || robot_id <= 1) {
            message.error("You don't have any robot id");
            return;
        }

        if (!conditionValue || conditionValue.length < 1) {
            message.error("You don't have any condition value");
            return;
        }

        message.info("Okay, here we try to upload your data");
        const filtered = robots_data.filter(item => item.robot_id !== robot_id);

        try {
            const ref = doc(db, "robots_check", "robot_array");

            const template = {
                robot_id: robot_id,
                condition: conditionValue,
                date: dayjs().valueOf(),
                remarks: noteValue,
            }

            dispatch(addRobot(template));

            await updateDoc(ref, {
                array: [...filtered, template]
            });
            setNoteValue("")
            message.success("Robot successfully add");
        } catch (error) {
            message.error("Failed");
        }
    };


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
                <Radio.Group value={conditionValue} onChange={onChangeRadio} buttonStyle="solid">
                    <Radio.Button value="good">Good</Radio.Button>
                    <Radio.Button value="bad">Bad</Radio.Button>
                    <Radio.Button value="not_inspected">Not inspected</Radio.Button>
                </Radio.Group>
                <Button onClick={onSaveClick} type={"primary"}>Save</Button>
                {conditionValue === "bad" &&
                    <div style={{width: '100%', display: 'grid', gridTemplateColumns: "1fr 1fr", alignItems: "center"}}>
                        <Form.Item
                            style={{minWidth: "50%"}}
                            label="Please load picture of problems"
                            name="upload"
                            valuePropName="fileList"
                            getValueFromEvent={(e) => e.fileList} // Ensures that fileList is properly handled
                        >
                            <Upload>
                                <Button icon={<UploadOutlined/>}>Click to Upload</Button>
                            </Upload>
                        </Form.Item>
                        <Input
                            value={noteValue}
                            multiple
                            placeholder={"Please write here notes why robot is broken"}
                            onChange={(event) => setNoteValue(event.target.value)}
                        />
                    </div>
                }
            </Form>
            <RobotsList robot_id={robot_id}/>
        </div>
    );
};

export default RobotsInspection;