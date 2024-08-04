import React, { useEffect, useState } from 'react';
import {Badge, Descriptions, DescriptionsProps, GetProps, Input, List, Typography} from 'antd';
import styles from './WorkStationTasks.module.css';
import axios from 'axios';
import { IDemandApiResponse } from '../../types/Shelfs';
import dayjs from 'dayjs';
import TableView from './TableView';

type OTPProps = GetProps<typeof Input.OTP>;

const { Title } = Typography;

interface DataItem {
    siteCode: string;
    hodCode: string;
    stopPointCode: string;
    taskCanceled: boolean;
    haveSendBack: boolean;
    dispatchStatus: 'FETCHING' | 'ARRIVED';
}

// Интерфейс для ответа API
interface ApiResponse {
    code: number;
    msg: string; // Строка JSON, которая может быть распарсена при необходимости
    data: DataItem[];
    succ: boolean;
}

const WorkStationTasks = () => {
    const [response, setResponse] = useState<ApiResponse | null>(null);
    const [shelfsResponse, setShelfsResponse] = useState<IDemandApiResponse | null>(null);

    const [side_code, setSide_code] = useState<string>('9999');

    const [sorted, setSorted] = useState<DataItem[] | null>(null);

    const fetchData = (siteCode: string) => {
        // Fetching data using fetch
        fetch('http://10.46.143.3/apollo/ws/api/station/tools/getAllDemandInfo', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                siteCode,
                containerCode: '',
            }),
        })
            .then((response) => response.json())
            .then((data) => setResponse(data as ApiResponse))
            .catch((error) => console.error('Fetch Error:', error));

        // Fetching data using axios
        const requestBody = {
            siteCode,
        };

        axios
            .post<IDemandApiResponse>('http://10.46.143.3/apollo/ws/api/station/tools/getAllDispatchList', requestBody)
            .then((response) => {
                setShelfsResponse(response.data); // Assuming response.data contains the actual data
            })
            .catch((error) => {
                console.error('Axios Error:', error);
            });
    };

    const onChange: OTPProps['onChange'] = (text) => {
        setSide_code(text);
        fetchData(text);
    };

    const sharedProps: OTPProps = {
        onChange,
    };

    useEffect(() => {
        const intervalId = setInterval(() => {
            fetchData(side_code);
        }, 1000); // Refresh data every second

        return () => clearInterval(intervalId); // Cleanup interval on component unmount
    }, [side_code]);




    return (
        <div>
            <div className={styles.Input_body}>
                <article>Work station number:</article>
                <Input.OTP length={4} formatter={(str) => str.toUpperCase()} {...sharedProps} />
            </div>
            <TableView site_code={side_code} />
            <List
                style={{ marginTop: 24 }}
                bordered
                dataSource={response?.data || []}
                renderItem={(item, index) => {
                    let task_id = 0;
                    let priority = 0;
                    let create_time = '';
                    let isArrived = '';
                    let isComing = '';

                    if (shelfsResponse && shelfsResponse.data) {
                        shelfsResponse.data.forEach((el) => {
                            if (item.hodCode === el.hodCode) {
                                task_id = el.taskId;
                                priority = el.priority;
                                create_time = dayjs(el.demandTime).format('YYYY-MM-DD HH:mm:ss');
                                isArrived = item.dispatchStatus === 'ARRIVED' ? 'Arrived' : 'Not Arrived';
                                isComing = item.dispatchStatus === 'FETCHING' ? 'Coming' : 'Not Coming';
                            }
                        });
                    }

                    const items: DescriptionsProps['items'] = [
                        {
                            key: '1',
                            label: 'Task ID',
                            children: `${task_id}`,
                        },
                        {
                            key: '2',
                            label: 'Priority',
                            children: `${priority}`,
                        },
                        {
                            key: '3',
                            label: 'Created at',
                            children: `${create_time}`,
                        },{
                            key: '5',
                            children: (
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14}}>
                                    <Badge status={isComing === "Coming" ? "processing" : "success"} /> <p style={{fontSize: 12}}>{isComing}</p>
                                </div>
                            ),
                        },
                        {
                            key: '5',
                            children: (
                                <div style={{display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14}}>
                                    <Badge status={isArrived === "Not Arrived" ? "error" : "success"} /> <p style={{fontSize: 12}}>{isArrived}</p>
                                </div>
                            ),
                        },
                    ];

                    return (
                        <List.Item>
                            <Descriptions title={item.hodCode} items={items} />
                        </List.Item>
                    );
                }}
            />
        </div>
    );
};

export default WorkStationTasks;
