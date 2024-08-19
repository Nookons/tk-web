import React, {useState} from 'react';
import {Cascader, Form, Input, Radio, message} from "antd";
import {useForm} from "antd/es/form/Form";
import Button from "antd/es/button";
import {MaskedInput} from "antd-mask-input";
import {doc, getDoc, setDoc, updateDoc, arrayUnion} from 'firebase/firestore';
import {db} from "../../firebase";
import dayjs from "dayjs";
import {useAppDispatch, useAppSelector} from "../../hooks/storeHooks";
import RobotsList from "./RobotsList";
import {addRobot} from "../../store/reducers/Robots";
import {IRobot} from "../../types/Robot";
import TextArea from "antd/es/input/TextArea";

const RobotsInspection: React.FC = () => {
    const dispatch = useAppDispatch();
    const user = useAppSelector(state => state.currentUser.user)
    const [form] = useForm();
    const [robotCondition, setRobotCondition] = useState<string>('good');
    const robot_id_mask = "(00) 00-000";

    const onFormFinish = async (values: any) => {

        const problem_component = {
            time: dayjs().valueOf(),
            component: values.component || '',
            username: user && user.firstName + ' ' + user.lastName || '',
            note: values.note || '',
            id: Date.now()
        }

        const data = {
            update_time: dayjs().valueOf(),
            robot_id: values.robot_id.replace(/\D/g, ''),  // Убираем все символы, кроме цифр
            condition: values.condition || '',
            username: user && user.firstName + ' ' + user.lastName || '',
        };

        try {
            const docRef = doc(db, "robots", data.robot_id);  // Ссылка на документ в Firestore
            const docSnap = await getDoc(docRef);  // Проверяем, существует ли документ

            if (docSnap.exists()) {
                if (data.condition === 'bad') {
                    await updateDoc(docRef, {
                        ...data,
                        problem_component: arrayUnion(problem_component),
                    });
                } else {
                    if (docSnap.data().condition === "bad") {
                        throw new Error("You need fix robot first")
                    } else {
                        await updateDoc(docRef, {
                            ...data,
                        });
                    }
                }
            } else {
                await setDoc(docRef, data);
            }

            form.resetFields()
            dispatch(addRobot(data as IRobot))
            message.success("Inspection data saved successfully!");
        } catch (err) {
            err && message.error(err.toString());
        }
    };

    return (
        <div>
            <Form
                form={form}
                name="robot_inspection"
                initialValues={{remember: true}}
                onFinish={onFormFinish}
                style={{maxWidth: "98%", display: "flex",justifyContent: "space-between", flexWrap: "wrap" ,gap: 14}}
                variant={"outlined"}
              >
                <Form.Item
                    label="Robot ID"
                    name="robot_id"
                    rules={[{required: true, message: "Robot ID can't be empty"}]}
                >
                    <MaskedInput mask={robot_id_mask}/>
                </Form.Item>

                <Form.Item
                    label="Robot Condition"
                    name="condition"
                    rules={[{required: true, message: "Condition can't be empty"}]}
                >
                    <Radio.Group onChange={(e) => setRobotCondition(e.target.value)}>
                        <Radio value="good">Good</Radio>
                        <Radio value="bad">Bad</Radio>
                        <Radio value="not_inspected">Not Inspected</Radio>
                    </Radio.Group>
                </Form.Item>

                {robotCondition === 'bad' && (
                    <>
                        <Form.Item style={{width: "100%"}} label="Notes" name="note">
                            <TextArea rows={2}/>
                        </Form.Item>


                        <Form.Item
                            label="Component Selection"
                            name="component"
                            rules={[{required: true, message: "Please select a component!"}]}
                        >
                            <Cascader
                                style={{minWidth: 320}}
                                options={[
                                    {
                                        value: "Wheels",
                                        label: "Wheels",
                                        children: [
                                            {
                                                value: "00-10-10053",
                                                label: "Left Wheels (00-10-10053)",
                                            },
                                            {
                                                value: "00-10-10054",
                                                label: "Right Wheels (00-10-10054)",
                                            },
                                        ],
                                    },
                                    {
                                        value: "Motors",
                                        label: "Motors",
                                        children: [
                                            {
                                                value: "UP Motor",
                                                label: "UP Motor",
                                                children: [
                                                    {
                                                        value: "00-10-10055",
                                                        label: "00-10-10055",
                                                    },
                                                    {
                                                        value: "00-10-10056",
                                                        label: "00-10-10056",
                                                    },
                                                    {
                                                        value: "00-10-10057",
                                                        label: "00-10-10057",
                                                    },
                                                ],
                                            },
                                            {
                                                value: "Turn motors",
                                                label: "Turn motors",
                                                children: [
                                                    {
                                                        value: "00-10-10058",
                                                        label: "00-10-10058",
                                                    },
                                                    {
                                                        value: "00-10-10059",
                                                        label: "00-10-10059",
                                                    },
                                                    {
                                                        value: "00-10-10060",
                                                        label: "00-10-10060",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                    {
                                        value: "Platform",
                                        label: "Platform",
                                        children: [
                                            {
                                                value: "UP Motor",
                                                label: "UP Motor",
                                                children: [
                                                    {
                                                        value: "00-11-10055",
                                                        label: "00-11-10055",
                                                    },
                                                    {
                                                        value: "00-12-10056",
                                                        label: "00-12-10056",
                                                    },
                                                    {
                                                        value: "00-13-10057",
                                                        label: "00-13-10057",
                                                    },
                                                ],
                                            },
                                            {
                                                value: "Rotate Motor",
                                                label: "Rotate Motor",
                                                children: [
                                                    {
                                                        value: "13-11-10055",
                                                        label: "13-11-10055",
                                                    },
                                                ],
                                            },
                                        ],
                                    },
                                ]}
                            />
                        </Form.Item>
                    </>
                )}

                <Form.Item wrapperCol={{offset: 8, span: 16}}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            <RobotsList />
        </div>
    );
};

export default RobotsInspection;
