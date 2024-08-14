import React, { useEffect, useState, useMemo } from 'react';
import { List } from 'antd';
import dayjs from 'dayjs';
import { useFetchShifts } from '../../hooks/useFetchShifts';
import { useFetchEmployees } from '../../hooks/useFetchEmploers';
import { IEmployer } from '../../types/Employer';

const TodayWork = () => {
    const employersData = useFetchEmployees();
    const shiftsData = useFetchShifts();
    const [shifts, setShifts] = useState({
        dayShiftData: [] as IEmployer[],
        nightShiftData: [] as IEmployer[],
        dayOffData: [] as IEmployer[],
    });

    // Memoize the current date to ensure it doesn't change on re-renders
    const currentDate = useMemo(() => dayjs().format('MM-DD'), []);

    useEffect(() => {
        if (!employersData || !shiftsData) return;

        const { employees } = employersData;
        const { shifts } = shiftsData;

        const dayShiftData: IEmployer[] = [];
        const nightShiftData: IEmployer[] = [];

        // Create a map for quick lookup
        const employeeShiftMap = new Map<string, string>();

        shifts.forEach(shift => {
            shift.shifts.forEach(employerShift => {
                if (dayjs(employerShift.date).format('MM-DD') === currentDate && shift.employer) {
                    employeeShiftMap.set(shift.employer.toString(), employerShift.type);
                }
            });
        });

        employees.forEach(employer => {
            const shiftType = employeeShiftMap.get(employer.id.toString());
            if (shiftType === 'Day') {
                dayShiftData.push(employer);
            } else if (shiftType === 'Night') {
                nightShiftData.push(employer);
            }
        });

        const dayOffData = employees.filter(
            employee => !dayShiftData.some(day => day.id === employee.id) &&
                !nightShiftData.some(night => night.id === employee.id)
        );

        // Only update state if the computed values have actually changed
        setShifts(prevShifts => {
            const hasChanged =
                JSON.stringify(prevShifts.dayShiftData) !== JSON.stringify(dayShiftData) ||
                JSON.stringify(prevShifts.nightShiftData) !== JSON.stringify(nightShiftData) ||
                JSON.stringify(prevShifts.dayOffData) !== JSON.stringify(dayOffData);

            return hasChanged ? {
                dayShiftData,
                nightShiftData,
                dayOffData
            } : prevShifts;
        });

    }, [employersData, shiftsData, currentDate]);

    const renderList = (title: string, data: IEmployer[]) => (
        <List
            header={<article>( {data.length} ) {title}</article>}
            bordered
            style={{ marginBottom: 14 }}
            dataSource={data}
            renderItem={(item) => (
                <List.Item>
                    {item.firstName} {item.lastName}
                </List.Item>
            )}
        />
    );

    return (
        <div>
            {renderList('Day Shift', shifts.dayShiftData)}
            {renderList('Night Shift', shifts.nightShiftData)}
            {renderList('On Weekend', shifts.dayOffData)}
        </div>
    );
};

export default TodayWork;
