import React, {useEffect, useState, useMemo} from 'react';
import {Card, Divider, List, message, Row, Statistic, Tag, Timeline} from 'antd';
import dayjs from 'dayjs';
import {useFetchShifts} from '../../hooks/useFetchShifts';
import {useFetchEmployees} from '../../hooks/useFetchEmploers';
import {IEmployer} from '../../types/Employer';
import Col from "antd/es/grid/col";
import {ExpandAltOutlined, MehOutlined, MoonOutlined, SmileOutlined, SunOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {EMPLOYER_ROUTE} from "../../utils/consts";

const TodayWork = () => {
    const navigate = useNavigate();
    const employersData = useFetchEmployees();
    const shiftsData = useFetchShifts();

    const [shifts, setShifts] = useState({
        dayShiftData: [] as IEmployer[],
        nightShiftData: [] as IEmployer[],
        dayOffData: [] as IEmployer[],
    });

    const current_date = dayjs().format("dddd, MMMM DD, YYYY");


    useEffect(() => {
        if (!employersData || !shiftsData) return;

        const {employees} = employersData;
        const {shifts} = shiftsData;

        const dayShiftData: IEmployer[] = [];
        const nightShiftData: IEmployer[] = [];

        // Create a map for quick lookup
        const employeeShiftMap = new Map<string, string>();

        shifts.forEach(shift => {
            shift.shifts.forEach(employerShift => {
                if (dayjs(employerShift.date).format('dddd, MMMM DD, YYYY') === current_date && shift.employer) {
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

    }, [employersData, shiftsData, current_date]);

    const renderList = (data: IEmployer[]) => {
        return data.map((employer) => {
            const onUserClick = () => {
                const params = new URLSearchParams({id: employer.id.toString()});
                navigate(`${EMPLOYER_ROUTE}?${params}`);
            };

            return (
                <Tag
                    key={employer.id}
                    onClose={onUserClick}
                    style={{
                        maxWidth: '100%',
                        backgroundColor: employer.position === 'Leader' ? '#a1ffff' : '',
                    }}
                    closable={true}
                    closeIcon={<ExpandAltOutlined/>}
                >
                    {employer.firstName} {employer.lastName}
                </Tag>
            );
        });
    };

    return (
        <Card title={<Divider>Today {current_date}</Divider>}>
            <Row gutter={4} justify={"center"} wrap={true}>
                <Col style={{minWidth: "200px", marginTop: 4}} span={8}>
                    <Card>
                        <Statistic prefix={<SunOutlined/>} title="Day" value={shifts.dayShiftData.length}/>
                        {renderList(shifts.dayShiftData)}
                    </Card>
                </Col>
                <Col style={{minWidth: "200px", marginTop: 4}} span={8}>
                    <Card>
                        <Statistic prefix={<MoonOutlined/>} title="Night" value={shifts.nightShiftData.length}/>
                        {renderList(shifts.nightShiftData)}
                    </Card>
                </Col>
                <Col style={{minWidth: "200px", marginTop: 4}} span={8}>
                    <Card>
                        <Statistic prefix={<SmileOutlined/>} title="Day Off" value={shifts.dayOffData.length}/>
                        {renderList(shifts.dayOffData)}
                    </Card>
                </Col>
            </Row>
        </Card>
    );
};

export default TodayWork;
