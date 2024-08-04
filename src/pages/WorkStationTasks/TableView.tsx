import React, {FC, useEffect, useState} from 'react';
import styles from './WorkStationTasks.module.css'
import dayjs from "dayjs";

interface TableViewProps {
    site_code: string;
}

interface OperationPoint {
    id: number;
    operationPointCode: string;
    operationPointName: string;
    siteCode: string;
    loadType: number;
    loadConfig: string | null;
    currentLoadConfig: string | null;
    loadCode: string;
    locationX: number;
    locationY: number;
    cellCode: string;
    occupancyState: number;
    operationOrder: number;
    placeDir: string | null;
    nodeCode: string;
    cacheNodeCode: string;
    parkId: number;
    stopPointType: number;
    unloadMode: string | null;
    reservation1: string;
    reservation2: string;
    reservation3: string;
    reservation4: string;
    reservation5: string;
    reservation6: string;
    status: number;
    creator: string;
    creationTime: number;
    modifier: string;
    modifyTime: number;
    taskLimit: number;
    handlingWay: string | null;
    seedingWallType: string | null;
    designatedSeedingRule: any[]; // Specify a more detailed type if known
    maxQueueRobotNum: number;
    picklatticeRowindex: number;
    picklatticeCollindex: number;
    putlatticeRowindex: number | null;
    putlatticeCollindex: number | null;
    hasBCR: boolean | null;
    hasWeight: boolean | null;
    weightEnable: number;
    containerOverWeightLimit: number;
    containerOverWeightMode: string;
    parkType: string | null;
    gripperCode: string;
    bcrenable: number;
}

interface DataItem {
    siteCode: string;
    taskType: string | null;
    currentFunctionType: string | null;
    left: OperationPoint | null;
    right: OperationPoint | null;
    toolSeedingWalls: any | null; // Specify a more detailed type if known
}

interface ApiResponse {
    code: number;
    data: DataItem[];
    msg: string;
    succ: boolean;
}

const TableView:FC<TableViewProps> = ({site_code}) => {

    const [response, setResponse] = useState<ApiResponse | null>(null);
    const [currentTarget, setCurrentTarget] = useState<DataItem | null>(null);

    const fetchData = () => {
        fetch('http://10.46.143.3/apollo/ws/api/station/tools/listAllSite', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            }
        })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok ' + response.statusText);
                }
                return response.json();
            })
            .then(data => {
                setResponse(data);
            })
            .catch(error => {
                console.error('There was a problem with the fetch operation:', error);
            });
    };

    useEffect(() => {
        fetchData();
        const intervalId = setInterval(fetchData, 1000);
        return () => clearInterval(intervalId);
    }, [site_code]);

    useEffect(() => {
        response?.data.forEach(el => {
            if (el.siteCode === site_code) {
                console.log(el);
                setCurrentTarget(el)
            }
        })
    }, [response]);

    return (
        <div style={{
            marginTop: 24,
            backgroundColor: "rgba(0,0,0, 0.025)",
            padding: 14,
            borderRadius: 8
        }}>
            <article>Process type: {currentTarget?.taskType}</article>
            <div className={styles.Table_body}>
                <div className={styles.Left_side}>
                    <p>📦 {dayjs(currentTarget?.left?.modifyTime).fromNow()} at {dayjs(currentTarget?.left?.modifyTime).format("HH:mm:ss")}</p>
                </div>
                <div className={styles.Rigth_side}>
                    <p>📦 {dayjs(currentTarget?.right?.modifyTime).fromNow()} at {dayjs(currentTarget?.right?.modifyTime).format("HH:mm:ss")}</p>
                </div>
            </div>
        </div>
    );
};

export default TableView;