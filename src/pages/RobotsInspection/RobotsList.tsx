import React, {useEffect, useState} from 'react';
import {collection, query, onSnapshot} from "firebase/firestore";
import {db} from "../../firebase";
import {Button, Descriptions, DescriptionsProps, List} from "antd";
import dayjs from "dayjs";
import firebase from "firebase/compat";

interface IRobot {
    condition: string;
    date: number;
    robot_id: number;
}

const RobotsList = () => {

    const [data, setData] = useState<IRobot[] | null>(null);

    useEffect(() => {
        const q = query(collection(db, "robots_check"));
        const unsubscribe = onSnapshot(q, (querySnapshot) => {
            const robots: IRobot[] = [];

            querySnapshot.forEach((doc) => {
                robots.push(doc.data() as IRobot);
            });

            // Assuming date is either a Firestore Timestamp or a string that can be parsed by dayjs
            const sorted = robots.sort((a, b) => dayjs(a.date).valueOf() + dayjs(b.date).valueOf());

            setData(sorted);
        });

        // Cleanup function to unsubscribe from Firestore updates
        return () => unsubscribe();
    }, []);

    if (!data) {
        return null;
    }

    return (
        <div>
            <List
                style={{ marginTop: 24 }}
                bordered
                dataSource={data || []}
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
                            children: `${item.condition}`,
                        },
                        {
                            key: '3',
                            label: 'Created at',
                            children: `${dayjs(item.date).format("YYYY-MM-DD")}`,
                        },
                    ];

                    return (
                        <List.Item>
                            <Descriptions title={item.robot_id} items={items} />
                        </List.Item>
                    )
                }}
            />
        </div>
    );
};

export default RobotsList;