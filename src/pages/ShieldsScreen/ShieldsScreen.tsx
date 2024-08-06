import React from 'react';
import {Calendar} from 'antd';
import dayjs from 'dayjs';

const CustomCalendar: React.FC = () => {
    const currentDay = dayjs().date();
    const currentMonth = dayjs().month();

    const customCellRender = (date: dayjs.Dayjs) => {
        const isToday = date.date() === currentDay && date.month() === currentMonth;

        return (
            <div>
                <div>
                    <p style={{fontSize: 14}}>Night Shift</p>
                    <p style={{fontSize: 14}}>18:00 - 06:00</p>
                </div>
            </div>
        );
    };

    return (
        <Calendar
            fullscreen={true}
            dateCellRender={customCellRender} // Используем dateCellRender для рендеринга ячеек дат
        />
    );
};

export default CustomCalendar;
