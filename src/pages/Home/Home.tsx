import React, { useEffect } from 'react';
import styles from './Home.module.css'
import TodayWork from "./TodayWork";
import TodayTasks from "./TodayTasks/TodayTasks";
import TomorowWork from "./TomorowWork";

const Home: React.FC = () => {

    return (
        <div>
            <div className={styles.Home_body}>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14
                }}>
                    <TodayWork />
                    <TomorowWork />
                </div>
                <div>
                    <TodayTasks />
                </div>
            </div>
        </div>
    );
};

export default Home;
