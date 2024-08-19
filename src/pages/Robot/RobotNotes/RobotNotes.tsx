import React, {FC, useEffect, useState} from 'react';
import AddNote from "./AddNote";
import {IRobot, IRobotNote} from "../../../types/Robot";
import {Card, Empty, Spin} from "antd";
import dayjs from "dayjs";
import Button from "antd/es/button";
import {DeleteOutlined, EditOutlined} from "@ant-design/icons";
import {onRobotRemoveNote} from "../../../utils/Robot/RemoveRobotNote";
import Note from "./Note";

interface RobotNotesProps {
    current_robot: IRobot | null;
}

const RobotNotes: FC<RobotNotesProps> = ({current_robot}) => {
    const [reversed_data, setReversed_data] = useState<IRobotNote[]>([]);

    useEffect(() => {
        if (current_robot && current_robot.robot_notes) {
            const reversedNotes = [...current_robot.robot_notes].reverse();
            setReversed_data(reversedNotes);
        }
    }, [current_robot]);

    if (current_robot) {
        return (
            <div>
                <AddNote robot_id={current_robot.robot_id}/>
                <div style={{
                    display: "flex",
                    flexDirection: "column",
                    gap: 14
                }}>
                    {reversed_data.length
                        ? reversed_data.map(note => (<Note note={note} robot_id={current_robot.robot_id}/>))
                        : <Empty/>
                    }
                </div>
            </div>
        );
    }
    return <Spin/>
};

export default RobotNotes;