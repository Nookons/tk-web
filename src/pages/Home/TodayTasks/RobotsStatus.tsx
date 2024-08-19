import React, {useEffect, useState} from 'react';
import {useAppSelector} from "../../../hooks/storeHooks";
import {
    Badge,
    Button,
    Card,
    Collapse,
    Divider,
    Image,
    Row,
    Skeleton,
    Spin,
    Statistic,
    Table,
    Tag,
    Timeline
} from "antd";
import {IRobot} from "../../../types/Robot";
import dayjs from "dayjs";
import {
    AlertOutlined, CheckCircleOutlined,
    ExpandAltOutlined,
    LikeOutlined,
    MehOutlined,
    SmileOutlined,
    YoutubeOutlined
} from "@ant-design/icons";
import Col from "antd/es/grid/col";
import {useNavigate} from "react-router-dom";
import {ROBOT_ROUTE} from "../../../utils/consts";

const RobotsStatus = () => {
    const navigate = useNavigate();
    const {items, loading, error} = useAppSelector(state => state.robots)

    const [not_inspected_data, setNot_inspected_data] = useState<IRobot[]>([]);
    const [inspected_data, setInspected_data] = useState<IRobot[]>([]);
    const [bad_robots_data, setBad_robots_data] = useState<IRobot[]>([]);

    const [last_inspection, setLast_inspection] = useState<IRobot[]>([]);
    const robot_id_mask = '+48 (000) 000-000';

    useEffect(() => {
        const filtered = items.filter(item => item.condition === "not_inspected")
        const inspected = items.filter(item => item.condition === "good")
        const bad_robots = items.filter(item => item.condition === "bad")

        const last_inspection = inspected.sort((a, b) => b.update_time - a.update_time)
        const bad_robots_sorted = bad_robots.sort((a, b) => b.update_time - a.update_time)

        last_inspection && setLast_inspection(last_inspection.slice(0, 3).reverse())

        setNot_inspected_data(filtered as IRobot[]);
        setInspected_data(inspected as IRobot[]);
        setBad_robots_data(bad_robots_sorted as IRobot[]);
    }, [items]);

    const onRobotClick = (robot: IRobot) => {
        const params = new URLSearchParams({id: robot.robot_id.toString()});
        navigate(`${ROBOT_ROUTE}?${params}`)
    }

    return (
        <div>
            <Card title="Robots inspection card" loading={loading}>
                <Row gutter={4}>
                    <Col span={12}>
                        <Card>
                            <Statistic prefix={<MehOutlined/>} title="Waiting for inspection"
                                       value={not_inspected_data.length}/>
                        </Card>
                    </Col>
                    <Col span={12}>
                        <Card>
                            <Statistic prefix={<SmileOutlined/>} title="Checked" value={inspected_data.length}/>
                        </Card>
                    </Col>
                </Row>
                <Card
                    type="inner"
                    title={"Last robots on inspection"}
                    style={{marginTop: 16}}
                >
                    <Timeline reverse={true} pending={true} mode={"alternate"}>
                        {last_inspection.map(el => (
                            <Timeline.Item
                                label={
                                    <Tag onClick={() => onRobotClick(el)} style={{cursor: "pointer"}}
                                         icon={<ExpandAltOutlined/>} color="rgba(0,0,0, .35)">
                                        {el.robot_id.toString().replace("13", "13-")}
                                    </Tag>
                                }>
                                <p style={{
                                    color: "#8c8c8c",
                                    fontSize: 16
                                }}>{dayjs(el.update_time).format("dddd, MMMM DD, YYYY [at] HH:mm:ss")}</p>
                            </Timeline.Item>
                        ))}
                    </Timeline>
                </Card>
                <Row style={{marginTop: 14}} gutter={4}>
                    <Col span={24}>
                        <Collapse  defaultActiveKey={["1"]} bordered={false} >
                            {bad_robots_data.map(robot => (
                                <Collapse.Panel header={

                                        <Divider>
                                            <AlertOutlined /> <br/>
                                            {robot.robot_id.toString().replace("13", "13-")}
                                            <p style={{color: "rgba(0,0,0,0.35)"}}>{dayjs(robot.update_time).format("dddd, MMMM DD, YYYY [at] HH:mm:ss")}</p>
                                        </Divider>
                                  } key={robot.robot_id} showArrow={false}>
                                    <div style={{
                                        display: "flex",
                                        justifyContent: "space-between",
                                        gap: 4,
                                        margin: "14px 0",
                                    }}>
                                        <Button onClick={() => onRobotClick(robot)} style={{width: '100%'}}><ExpandAltOutlined/>Open Robot</Button>
                                        <Button style={{width: '100%'}}><CheckCircleOutlined />Repair</Button>
                                    </div>
                                    <article style={{
                                        textAlign: "center",
                                        textTransform: "capitalize",
                                        backgroundColor: "rgba(255,0,0, .95)",
                                        padding: 4,
                                        borderRadius: 4,
                                        color: "white"
                                    }}>{robot.note}</article>
                                </Collapse.Panel>
                            ))}
                        </Collapse>
                    </Col>
                </Row>
            </Card>
        </div>
    );
};

export default RobotsStatus;