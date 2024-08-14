import React, { useEffect, useState } from 'react';
import { message, Calendar, Select, Spin, Divider, Button } from 'antd';
import dayjs, { Dayjs } from 'dayjs';
import { doc, getDoc, setDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import {useFetchEmployees} from "../../hooks/useFetchEmploers";
import {IShiftData} from "../../types/Shifts";

const { Option } = Select;

interface Employee {
    id: number;
    firstName: string;
    lastName: string;
}

const AddShifts: React.FC = () => {
    const { employees, loading: loadingEmployees, error } = useFetchEmployees();
    const [selectedEmployee, setSelectedEmployee] = useState<number | null>(null);
    const [shiftType, setShiftType] = useState<'Day' | 'Night'>('Day');
    const [data, setData] = useState<IShiftData>({
        shifts: []
    });

    useEffect(() => {
        if (selectedEmployee === null) return;

        const fetchShifts = async () => {
            try {
                const docRef = doc(db, 'shifts', selectedEmployee.toString());
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    setData(docSnap.data() as IShiftData);
                } else {
                    setData({ shifts: [] });
                }
            } catch (err) {
                message.error('Failed to fetch shifts.');
            }
        };

        fetchShifts();
    }, [selectedEmployee]);

    const handleDateClick = (date: Dayjs) => {
        setData((prev) => {
            const existingShift = prev.shifts.find((shift) =>
                dayjs(shift.date).isSame(date, 'day')
            );

            let newShifts;
            if (existingShift) {
                if (existingShift.type === shiftType) {
                    // Remove shift
                    newShifts = prev.shifts.filter((shift) => shift.date !== existingShift.date);
                } else {
                    // Replace shift with new type
                    newShifts = prev.shifts.map((shift) =>
                        shift.date === existingShift.date ? { date: date.valueOf(), type: shiftType } : shift
                    );
                }
            } else {
                // Add new shift
                newShifts = [...prev.shifts, { date: date.valueOf(), type: shiftType }];
            }

            return { ...prev, shifts: newShifts };
        });
    };

    const customCellRender = (date: Dayjs) => {
        const shift = data.shifts.find((shift) => dayjs(shift.date).isSame(date, 'day'));

        return (
            <div
                onClick={() => handleDateClick(date)}
                style={{
                    cursor: 'pointer',
                    height: '80%',
                    borderRadius: 8,
                    padding: 14,
                    background: shift ? (shift.type === 'Day' ? '#1890ff' : '#f5222d') : 'transparent',
                    color: shift ? '#fff' : 'inherit',
                }}
            >
                {shift ? shift.type : ''}
            </div>
        );
    };

    const onSaveClick = async () => {
        if (selectedEmployee === null) {
            message.error('Please select an employee.');
            return;
        }

        try {
            await setDoc(doc(db, 'shifts', selectedEmployee.toString()), {
                shifts: data.shifts,
                update_time: dayjs().valueOf(),
                employer: selectedEmployee
            });
            message.success('Shifts saved successfully.');
        } catch (err) {
            message.error('Failed to save shifts.');
        }
    };

    if (loadingEmployees) return <Spin tip="Loading employees..." />;
    if (error) return <p>{error}</p>;

    return (
        <div style={{ padding: '20px' }}>
            <Divider>Hours {data.shifts.length * 12} - {data.shifts.length} shifts of 12 hours each</Divider>
            <Select
                onChange={(value) => setSelectedEmployee(value)}
                style={{ width: '100%', marginBottom: '20px' }}
                placeholder="Select an employee"
            >
                {employees.map((employee: Employee) => (
                    <Option key={employee.id} value={employee.id}>
                        {employee.firstName} {employee.lastName}
                    </Option>
                ))}
            </Select>
            <Select
                onChange={(value) => setShiftType(value)}
                style={{ width: '100%', marginBottom: '20px' }}
                value={shiftType}
            >
                <Option value="Day">Day</Option>
                <Option value="Night">Night</Option>
            </Select>
            <Button onClick={onSaveClick} type="primary" style={{ marginBottom: '20px' }}>
                Save
            </Button>
            <Calendar fullscreen dateCellRender={customCellRender} />
        </div>
    );
};

export default AddShifts;
