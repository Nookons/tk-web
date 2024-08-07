import React, { useEffect } from 'react';
import axios from 'axios';
import styles from './Home.module.css'
import dayjs from "dayjs";
import {Divider, List} from "antd";
import TodayWork from "./TodayWork";

const Home: React.FC = () => {
    const current_date = dayjs().format("dddd, MMMM DD, YYYY");

    return (
        <div>
            <Divider>{current_date}</Divider>
            <div className={styles.Home_body}>
                <div>
                    <Divider>Today work...</Divider>
                    <TodayWork />
                </div>
                <div>
                    <Divider>Today tasks...</Divider>
                    <List
                        bordered
                        header={<div>Today tasks</div>}
                        dataSource={[]}
                        renderItem={(item) => <List.Item>{item}</List.Item>}
                    />
                </div>
            </div>
        </div>
    );
};

export default Home;
