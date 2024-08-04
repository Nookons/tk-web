import React, { useEffect } from 'react';
import axios from 'axios';
import styles from './Home.module.css'
import dayjs from "dayjs";
import {Divider} from "antd";
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
                </div>
            </div>
        </div>
    );
};

export default Home;
