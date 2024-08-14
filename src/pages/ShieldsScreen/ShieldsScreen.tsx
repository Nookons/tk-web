import React, { useEffect, useState } from 'react';
import {Button, Calendar, message, Modal, theme} from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { useAppSelector } from "../../hooks/storeHooks";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../../firebase";
import {IShift, IShiftData} from "../../types/Shifts";
import {MoonOutlined, SunOutlined, SwapOutlined} from "@ant-design/icons";
import SwapScreen from "./SwapScreen";

interface IModalData {
    isOpen: boolean;
    shift: IShift | null
}

const CustomCalendar: React.FC = () => {
    const { token } = theme.useToken();
    const user = useAppSelector(state => state.currentUser.user);

    const [shiftsData, setShiftsData] = useState<IShiftData>();

    const [modalData, setModalData] = useState<IModalData>({
        isOpen: false,
        shift: null
    });

    const wrapperStyle: React.CSSProperties = {
        width: "auto",
        borderRadius: token.borderRadiusLG,
    };

    useEffect(() => {
        const fetchShifts = async () => {
            if (user) {
                try {
                    const docRef = doc(db, 'shifts', user.id.toString());
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        setShiftsData(docSnap.data() as IShiftData);
                    } else {
                        setShiftsData({ shifts: [] });
                    }
                } catch (err) {
                    message.error('Failed to fetch shifts.');
                }
            }
        };

        fetchShifts();
    }, [user]);

    const onSwapClick = (shift: any) => {
        setModalData({
            isOpen: true,
            shift: shift
        })
    }

    const onCloseModal = () => {
        setModalData({
            isOpen: false,
            shift: null
        })
    }

    const customCellRender = (date: Dayjs) => {
        const shift = shiftsData?.shifts.find((shift) => dayjs(shift.date).isSame(date, 'day'));

        const cellStyle: React.CSSProperties = {
            cursor: 'pointer',
            height: '80%',
            display: "flex",
            flexDirection: "row",
            justifyContent: "center",
            alignItems: "center",
            marginTop: 8,
            gap: 8,
            border: shift ? `2px solid ${shift.type === 'Day' ? '#1890ff' : '#f5222d'}` : `1px solid ${token.colorBorderSecondary}`, // Увеличиваем рамку для выделения
            borderRadius: 8,
            padding: '8px', // Увеличиваем отступы для дней со сменами
            background: shift ? (shift.type === 'Day' ? '#e6f7ff' : '#fff1f0') : 'transparent', // Легкий фон для выделения
            color: shift ? '#000' : 'inherit',
        };

        return (
            <div>
                {shift ? <p style={cellStyle}>{dayjs(shift.date).isAfter()
                    ? <Button onClick={() => onSwapClick(shift)} type={"text"}>{shift.type === "Day" ? <SunOutlined /> : <MoonOutlined />} <SwapOutlined />{dayjs(shift.date).fromNow(true)}</Button>
                    : <Button onClick={() => message.error("Sorry but this day is gone")} type={"text"} style={{color: "red"}}>{shift.type === "Day" ? <SunOutlined/>: <MoonOutlined />}</Button>
                } </p> : ''}
            </div>
        );
    };

    return (
        <>
            <Modal onClose={onCloseModal} onCancel={onCloseModal} title="Swap shifts sreen" centered open={modalData.isOpen}>
                {modalData.shift && <SwapScreen shift={modalData.shift}/>}
            </Modal>
            <Calendar
                style={wrapperStyle}
                fullscreen={true}
                dateCellRender={customCellRender}
            />
        </>
    );
};

export default CustomCalendar;
