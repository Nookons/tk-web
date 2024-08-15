import React, {FC, useEffect, useState} from 'react';
import { collection, query, onSnapshot, setDoc, doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import {Badge, Button, Card, Descriptions, Divider, List, message, Modal, Pagination} from "antd";
import dayjs from "dayjs";
import {
    CheckSquareOutlined,
    ClockCircleOutlined,
    CloseCircleOutlined,
    DeleteOutlined, ExpandAltOutlined,
    RobotOutlined
} from "@ant-design/icons";
import { IRobot } from "../../types/Robot";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { removeRobot } from "../../store/reducers/Robots";
import RobotsFilter from "./RobotsFilter";
import {ROBOT_ROUTE} from "../../utils/consts";
import {useNavigate} from "react-router-dom";


const getCondition = (value: string) => {
    switch (value) {
        case "good":
            return <Badge status={"success"} text={"Good"}/>
        case "bad":
            return <Badge status={"error"} text={"Have some problems"}/>
        case "not_inspected":
            return <Badge status={"processing"} text={"Waiting for inspection"}/>
        default:
            return null
    }
}

interface RobotsListProps {
    robot_id: number
}

const RobotsList: FC<RobotsListProps> = (robot_id) => {
    const navigate = useNavigate();
    const data = useAppSelector(state => state.robots.items);
    const dispatch = useAppDispatch();

    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10);

    const [open, setOpen] = useState(false);
    const [currentRobot, setCurrentRobot] = useState<IRobot | null>(null);

    const [filteredArray, setFilteredArray] = useState<IRobot[] | null>(null);

    const showModal = (item: IRobot) => {
        setOpen(true);
        setCurrentRobot(item);
    };

    const handleOk = async () => {
        if (currentRobot) {
            try {
                const robotId = currentRobot.robot_id;
                dispatch(removeRobot(robotId));
                const washingtonRef = doc(db, "robots_check", "robot_array");

                await updateDoc(washingtonRef, {
                    array: data.filter(item => item.robot_id !== robotId)
                });
                message.success("Robot removed successfully");
            } catch (error) {
                message.error("Failed to remove robot");
            }
        }
        setOpen(false);
    };

    const handleCancel = () => {
        setOpen(false);
    };

    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = (filteredArray || data).slice(startIndex, startIndex + pageSize);

    const handlePageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        if (pageSize) setPageSize(pageSize);
    };

    const onRobotClick = (robot: IRobot) => {
        const params = new URLSearchParams({ id: robot.robot_id.toString() });
        navigate(`${ROBOT_ROUTE}?${params}`)
    }

    return (
        <div>
            <Modal
                open={open}
                title="Are you really sure you want to remove the robot?"
                onOk={handleOk}
                onCancel={handleCancel}
                footer={[
                    <Button key="cancel" onClick={handleCancel}>Cancel</Button>,
                    <Button key="ok" type="primary" onClick={handleOk}>Ok</Button>,
                ]}
            >
            </Modal>
            <Divider>Robots List</Divider>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 24
            }}>
                <Pagination
                    style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}
                    current={currentPage}
                    pageSize={pageSize}
                    total={filteredArray ? filteredArray.length : data.length}
                    onChange={handlePageChange}
                />
                <RobotsFilter  data={data} setFilteredArray={setFilteredArray} />
            </div>
            <List
                dataSource={paginatedData}
                bordered
                style={{marginTop: 24}}
                renderItem={(item, index) => {
                    const items = [
                        {
                            key: '1',
                            label: 'Robot ID',
                            children: `${item.robot_id}`,
                        },
                        {
                            key: '2',
                            label: 'Condition',
                            children: getCondition(item.condition),
                        },
                        {
                            key: '3',
                            label: 'Updated',
                            children: `${dayjs(item.date).format("dddd, MMMM DD, YYYY [at] HH:mm:ss")}`,
                        },
                        {
                            key: '4',
                            label: 'Notes',
                            children: `${item.remarks ? item.remarks : "Don't have any notes"}`,
                        },
                        {
                            key: '5',
                            children: <div style={{
                                width: "100%",
                                display: "flex",
                                justifyContent: "flex-end",
                                gap: 14
                            }}>
                                <Button onClick={() => onRobotClick(item)}><ExpandAltOutlined /> Open</Button>
                                <Button onClick={() => showModal(item)} ><DeleteOutlined /></Button>
                            </div>,
                        },
                    ];

                    return (
                        <List.Item key={item.robot_id}>
                            <Descriptions title={`# ${item.robot_id.toString().replace("13", "13-")}`} items={items} />
                        </List.Item>
                    );
                }}
            />
        </div>
    );
};

export default RobotsList;
