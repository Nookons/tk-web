import React, {FC, useState} from 'react';
import dayjs from "dayjs";
import Button from "antd/es/button";
import {onRobotRemoveNote} from "../../../utils/Robot/RemoveRobotNote";
import {DeleteOutlined} from "@ant-design/icons";
import {Card, message} from "antd";
import {IRobotNote} from "../../../types/Robot";

interface NoteProps {
    note: IRobotNote;
    robot_id: string;
}

const Note:FC <NoteProps> = ({note, robot_id}) => {

    const onRemove = async (note: IRobotNote) => {
        try {
            await onRobotRemoveNote(note, robot_id)
        } catch (err) {
            err && message.error(err.toString())
        }
    }

    return (
        <Card size={"small"} title={
            <p style={{color: "rgba(0,0,0, .35)"}}>
                {dayjs(note.date).format("dddd, MMMM DD, YYYY [at] HH:mm:ss")} by {note.username}
            </p>
        }>
            <div style={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                gap: 4,
                marginTop: 4
            }}>
                <article>{note.body}</article>
                <Button onClick={() => onRemove(note)} danger={true} type="primary"><DeleteOutlined /></Button>
            </div>
        </Card>
    );
};

export default Note;