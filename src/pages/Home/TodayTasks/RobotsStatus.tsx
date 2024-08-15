import React, {useEffect, useState} from 'react';
import {useAppSelector} from "../../../hooks/storeHooks";
import {Badge, Card, Row, Skeleton, Spin, Statistic, Tag, Timeline} from "antd";
import {IRobot} from "../../../types/Robot";
import dayjs from "dayjs";
import {ExpandAltOutlined, LikeOutlined, MehOutlined, SmileOutlined, YoutubeOutlined} from "@ant-design/icons";
import Col from "antd/es/grid/col";
import {useNavigate} from "react-router-dom";
import {ROBOT_ROUTE} from "../../../utils/consts";

const RobotsStatus = () => {
    const navigate = useNavigate();
    const {items, loading, error} = useAppSelector(state => state.robots)

    const [not_inspected_data, setNot_inspected_data] = useState<IRobot[]>([]);
    const [inspected_data, setInspected_data] = useState<IRobot[]>([]);

    const [last_inspection, setLast_inspection] = useState<IRobot[]>([]);

    useEffect(() => {
        const filtered = items.filter(item => item.condition === "not_inspected")
        const inspected = items.filter(item => item.condition === "good")

        const last_inspection = inspected.sort((a, b) => b.date - a.date)

        last_inspection && setLast_inspection(last_inspection.slice(0, 3))

        setNot_inspected_data(filtered as IRobot[]);
        setInspected_data(inspected as IRobot[]);
    }, [items]);

    const onRobotClick = (robot: IRobot) => {
        const params = new URLSearchParams({ id: robot.robot_id.toString() });
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
                                    <Tag onClick={() => onRobotClick(el)} style={{cursor: "pointer"}}  icon={<ExpandAltOutlined/>} color="rgba(0,0,0, .35)">
                                        {el.robot_id.toString().replace("13", "13-")}
                                    </Tag>
                                }>
                                <p style={{
                                    color: "#8c8c8c",
                                    fontSize: 16
                                }}>{dayjs(el.date).format("dddd, MMMM DD, YYYY [at] HH:mm:ss")}</p>
                            </Timeline.Item>
                        ))}
                    </Timeline>
                </Card>
            </Card>
        </div>
    );
};

export default RobotsStatus;