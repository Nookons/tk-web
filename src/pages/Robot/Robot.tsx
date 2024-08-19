import React, {useEffect, useMemo, useRef, useState} from 'react';
import {useLocation, useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../../hooks/storeHooks";
import {IRobot, IRobot_problem} from "../../types/Robot";
import {
    Button,
    Descriptions,
    Divider, Empty,
    Image, Mentions, message,
    QRCode,
    Space,
    Spin,
    Statistic,
    Tag,
    Timeline,
    Tour,
    TourProps,
    Tree
} from "antd";
import dayjs from "dayjs";
import {
    AlertOutlined, CheckCircleOutlined,
    DownOutlined, FileDoneOutlined,
    FrownFilled,
    FrownOutlined, LoadingOutlined,
    MehOutlined, RobotOutlined,
    SmileOutlined,
    TruckOutlined
} from "@ant-design/icons";
import {removeRobot} from "../../store/reducers/Robots";
import {onRobotRemove} from "../../utils/RobotRemove";

const getCondition = (condition: string | undefined) => {
    switch (condition) {
        case "bad":
            return <FrownOutlined style={{fontSize: 30}}/>
        case "good":
            return <SmileOutlined style={{fontSize: 30}}/>
        case "not_inspected":
            return <MehOutlined style={{fontSize: 30}}/>
        default:
            return ""
    }
}


const Robot = () => {
    const location = useLocation();
    const dispatch = useAppDispatch();

    const {items, loading, error} = useAppSelector(state => state.robots)
    const id = useMemo(() => new URLSearchParams(location.search).get('id'), [location.search]);

    const [current_robot, setCurrent_robot] = useState<IRobot | null>(null);

    useEffect(() => {
        if (items) {
            const current_robot = items.filter(item => item.robot_id === id)
            setCurrent_robot(current_robot[0])
        }
    }, [items]);

    if (loading) {
        return <Spin/>;
    }

    const onRemove = async () => {
        try {
            if (current_robot) {
                await onRobotRemove(current_robot);
                dispatch(removeRobot(current_robot.robot_id))
                window.history.back();
                message.success("Robot was remove")
            }
        } catch (err) {
            err && message.error(err.toString())
        }
    }

    return (
        <div style={{
            display: "grid",
            gridTemplateColumns: "1fr 0.25fr",
            gap: 24
        }}>
            <div>
                <Divider><RobotOutlined/> {current_robot?.robot_id.replace("13", "13-")}</Divider>
                <Descriptions title="Robot Info" bordered size="small">
                    <Descriptions.Item label="Condition">
                        <Divider>{getCondition(current_robot?.condition)}</Divider>
                    </Descriptions.Item>
                    <Descriptions.Item span={2} label="Last update by">{current_robot?.username}</Descriptions.Item>
                    <Descriptions.Item span={3} label="Last time update">{dayjs(current_robot?.update_time).format("dddd, MMMM DD, YYYY [at] HH:mm:ss")}</Descriptions.Item>
                    <Descriptions.Item span={3} label="note">{current_robot?.note || "None"}</Descriptions.Item>
                    <Descriptions.Item span={3} label="Robot QR">
                        <QRCode value={current_robot?.robot_id || ""} status={"active"} type={"canvas"}/>
                    </Descriptions.Item>
                </Descriptions>
                <div style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: 4,
                    margin: "14px 0",
                }}>
                    <Button type={"primary"}>Repair robot</Button>
                    <Button>Check History</Button>
                    <Button>Add note</Button>
                    <Button onClick={onRemove} danger={true}>Remove</Button>
                </div>
            </div>
            <div>
                <Divider><AlertOutlined/></Divider>
                {current_robot && current_robot.problem_component ?
                    <Tree
                        showLine
                        treeData={current_robot.problem_component.map(el => ({
                            title: <Tag>{el.note}</Tag>,
                            key: el.id,
                            children: el.component.map((i, index) => ({
                                title: `${i}`,
                                key: `${el.update_time}-${i}-${index}`,
                            }))

                        }))}
                    />
                    :
                    <Empty/>
                }
            </div>
        </div>
    );
};

export default Robot;