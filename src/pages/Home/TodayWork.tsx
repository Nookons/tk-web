import React from 'react';
import {List} from "antd";

const dayShift = [
    'DMYTRO DEMBOVSKYI',
    'SERHII LASHCHUK',
    'YAROSLAV TROKHYMCHUK',
];
const nightShift = [
    'DMITRII ZABIIAKA',
    'KOSTIANYN KRYVONIS',
    'ANTON SIDORENKO',
];
const onWeekend = [
    'DMYTRO KOLOMIIETS',
    'MYKYTA KYRYLOV',
    'VLADYSLAV LESIUK',
    'DMYTRO PANKIV',
    'DENYS KHARYTONCHUK',
];

const TodayWork = () => {
    return (
        <div>
            <List
                header={<div>Day Shift</div>}
                bordered
                style={{marginBottom: 14}}
                dataSource={dayShift}
                renderItem={(item) => (
                    <List.Item>
                        {item}
                    </List.Item>
                )}
            />
            <List
                header={<div>Night Shift</div>}
                bordered
                style={{marginBottom: 14}}
                dataSource={nightShift}
                renderItem={(item) => (
                    <List.Item>
                        {item}
                    </List.Item>
                )}
            />
            <List
                header={<div>On weekend</div>}
                bordered
                style={{marginBottom: 14}}
                dataSource={onWeekend}
                renderItem={(item) => (
                    <List.Item>
                        {item}
                    </List.Item>
                )}
            />
        </div>
    );
};

export default TodayWork;