import React, {useEffect, useState} from 'react';
import {collection, query, onSnapshot, setDoc, doc, deleteDoc } from "firebase/firestore";
import {db} from "../../firebase";
import {Badge, Button, Descriptions, DescriptionsProps, Divider, List, message, Pagination} from "antd";
import dayjs from "dayjs";
import {CheckSquareOutlined, ClockCircleOutlined, CloseCircleOutlined, RobotOutlined} from "@ant-design/icons";
import Radio from "antd/es/radio";

interface IRobot {
    condition: string;
    date: number;
    robot_id: number;
}

const RobotsList = () => {
    const [data, setData] = useState<IRobot[] | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [pageSize, setPageSize] = useState(10); // Items per page


    useEffect(() => {
        const unsub = onSnapshot(doc(db, "robots_check", "robot_array"), (doc) => {
            if (doc.exists()){
                setData(doc.data().array)
            }
        });
    }, []);

    const [not_inspected, setNot_inspected] = useState<IRobot[] | null>(null);
    const [inspected, setInspected] = useState<IRobot[] | null>(null);

    useEffect(() => {
        if (data) {
            const notInspected: IRobot[] = [];
            const inspected: IRobot[] = [];

            data.forEach(robot => {
                if (robot.condition === "not_inspected") {
                    notInspected.push(robot);
                } else {
                    inspected.push(robot);
                }
            });

            setNot_inspected(notInspected);
            setInspected(inspected);
        }
    }, [data]);


    if (!data) {
        return null;
    }



    // Pagination logic
    const startIndex = (currentPage - 1) * pageSize;
    const paginatedData = data.slice(startIndex, startIndex + pageSize);

    const handlePageChange = (page: number, pageSize?: number) => {
        setCurrentPage(page);
        if (pageSize) setPageSize(pageSize);
    };

    return (
        <div>
            <Divider>Robots List</Divider>
            <div style={{
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                gap: 24
            }}>
                <Pagination
                    style={{display: 'flex', alignItems: 'center', justifyContent: 'center'}}
                    current={currentPage}
                    pageSize={pageSize}
                    total={data.length}
                    onChange={handlePageChange}
                />
                <Radio.Group defaultValue={"all"} buttonStyle="solid">
                    <Radio.Button value="all"><RobotOutlined/> {data.length.toLocaleString()}</Radio.Button>
                    <Radio.Button value="inspected"><CheckSquareOutlined/> {inspected?.length.toLocaleString()}
                    </Radio.Button>
                    <Radio.Button value="not_inspected"><ClockCircleOutlined/> {not_inspected?.length.toLocaleString()}
                    </Radio.Button>
                    <Radio.Button value="bad"><CloseCircleOutlined/> 0</Radio.Button>
                </Radio.Group>
            </div>
            <List
                style={{marginTop: 24}}
                bordered
                dataSource={paginatedData}
                renderItem={(item, index) => {
                    const items: DescriptionsProps['items'] = [
                        {
                            key: '1',
                            label: 'Robot ID',
                            children: `${item.robot_id}`,
                        },
                        {
                            key: '2',
                            label: 'Condition',
                            children: <Badge status={item.condition === "not_inspected" ? "processing" : "success"}
                                             text={item.condition === "not_inspected" ? "Waiting for inspection" : "Inspected"}/>,
                        },
                        {
                            key: '3',
                            label: 'Created at',
                            children: `${dayjs(item.date).format("YYYY-MM-DD")}`,
                        },
                        {
                            key: '4',
                            children: <Button style={{width: "100%"}}>Remove</Button>,
                        },
                    ];

                    return (
                        <List.Item>
                            <Descriptions title={`# ${item.robot_id.toString().replace("13", "13-")}`} items={items}/>
                        </List.Item>
                    )
                }}
            />
        </div>
    );
};

export default RobotsList;
