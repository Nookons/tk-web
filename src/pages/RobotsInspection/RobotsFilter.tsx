import React, { useEffect, useState } from 'react';
import Radio from "antd/es/radio";
import { CheckSquareOutlined, ClockCircleOutlined, CloseCircleOutlined, RobotOutlined } from "@ant-design/icons";
import { IRobot } from "../../types/Robot";

interface RobotsFilterProps {
    data: IRobot[];
    setFilteredArray: (filteredData: IRobot[] | null) => void;
}

const RobotsFilter: React.FC<RobotsFilterProps> = ({ data, setFilteredArray }) => {
    const [filterValue, setFilterValue] = useState<string>("all");

    const all = data.length
    const goodCount = data.filter(item => item.condition === "good").length
    const badCount = data.filter(item => item.condition === "bad").length
    const notInspectedCount = data.filter(item => item.condition === "not_inspected").length

    useEffect(() => {
        let filteredData: IRobot[];

        const sortByDate = (a: IRobot, b: IRobot) => b.update_time - a.update_time;

        switch (filterValue) {
            case "inspected":
                filteredData = data
                    .filter(robot => robot.condition === "good")
                    .sort(sortByDate);
                break;
            case "not_inspected":
                filteredData = data
                    .filter(robot => robot.condition === "not_inspected")
                    .sort(sortByDate);
                break;
            case "bad":
                filteredData = data
                    .filter(robot => robot.condition === "bad")
                    .sort(sortByDate);
                break;
            default:
                filteredData = [...data].sort(sortByDate); // 'all'
                break;
        }

        setFilteredArray(filteredData);
    }, [filterValue, data, setFilteredArray]);

    const handleFilterChange = (e: any) => {
        setFilterValue(e.target.value);
    };

    return (
        <Radio.Group
            defaultValue="all"
            buttonStyle="solid"
            onChange={handleFilterChange}
        >
            <Radio.Button value="all"><RobotOutlined /> {all}</Radio.Button>
            <Radio.Button value="inspected"><CheckSquareOutlined /> {goodCount}</Radio.Button>
            <Radio.Button value="not_inspected"><ClockCircleOutlined /> {notInspectedCount}</Radio.Button>
            <Radio.Button value="bad"><CloseCircleOutlined /> {badCount}</Radio.Button>
        </Radio.Group>
    );
};

export default RobotsFilter;
