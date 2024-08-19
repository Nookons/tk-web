import React, {FC, useState} from 'react';
import { doc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase";
import {Badge, Button, Descriptions, Divider, List, message, Modal, Pagination, QRCode} from "antd";
import dayjs from "dayjs";
import {
    DeleteOutlined, ExpandAltOutlined,
} from "@ant-design/icons";
import { IRobot } from "../../types/Robot";
import { useAppDispatch, useAppSelector } from "../../hooks/storeHooks";
import { removeRobot } from "../../store/reducers/Robots";
import RobotsFilter from "./RobotsFilter";
import {ROBOT_ROUTE} from "../../utils/consts";
import {useNavigate} from "react-router-dom";
import {onRobotRemove} from "../../utils/Robot/RobotRemove";


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


const RobotsList: FC = () => {
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
                await onRobotRemove(robotId)
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
                            children: `${dayjs(item.update_time).format("dddd, MMMM DD, YYYY [at] HH:mm:ss")}`,
                        },
                        {
                            key: '4',
                            label: 'Notes',
                            children: `${item.note ? item.note : "Don't have any notes"}`,
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
