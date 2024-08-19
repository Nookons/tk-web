import React, {useEffect, useState} from 'react';
import {Card, Divider, Row, Statistic, Tag} from 'antd';
import dayjs from 'dayjs';
import {useFetchShifts} from '../../hooks/useFetchShifts';
import {IEmployer} from '../../types/Employer';
import Col from "antd/es/grid/col";
import {ExpandAltOutlined, MoonOutlined, SmileOutlined, SunOutlined} from "@ant-design/icons";
import {useNavigate} from "react-router-dom";
import {EMPLOYER_ROUTE} from "../../utils/consts";
import {useAppSelector} from "../../hooks/storeHooks";

const TodayWork = () => {
    const navigate = useNavigate();

    // Используем состояния для хранения данных смен
    const [dayResult, setDayResult] = useState<IEmployer[]>([]);
    const [nightResult, setNightResult] = useState<IEmployer[]>([]);
    const [dayOffResult, setDayOffResult] = useState<IEmployer[]>([]);

    const allShiftsData = useFetchShifts();
    const allEmployersData = useAppSelector(state => state.employers.items);

    const tomorrowDate = dayjs().add(1, 'day').format("dddd, MMMM DD, YYYY");

    useEffect(() => {
        // Временные массивы для накопления данных
        const tempDayResult: IEmployer[] = [];
        const tempNightResult: IEmployer[] = [];
        const dayOffResult: IEmployer[] = [];

        allShiftsData.shifts.forEach(userShifts => {
            const tomorrowShift = userShifts.shifts.find(shift =>
                dayjs(shift.date).format("dddd, MMMM DD, YYYY") === tomorrowDate
            );
            const needWorker = allEmployersData.find(employer => employer.id === userShifts.employer);

            if (tomorrowShift && needWorker) {
                switch (tomorrowShift.type) {
                    case "Day":
                        tempDayResult.push(needWorker);
                        break;
                    case "Night":
                        tempNightResult.push(needWorker);
                        break;
                    default:
                        break;
                }
            } else if (needWorker) {
                dayOffResult.push(needWorker)
            }
        });

        // Обновляем состояния
        setDayResult(tempDayResult);
        setNightResult(tempNightResult);
        setDayOffResult(dayOffResult);
    }, [allShiftsData, allEmployersData, tomorrowDate]);

    const renderList = (title: string, data: IEmployer[]) => {
        return data.map((employer) => {
            const onUserClick = () => {
                const params = new URLSearchParams({id: employer.id.toString()});
                navigate(`${EMPLOYER_ROUTE}?${params}`);
            };

            return (
                <Tag
                    key={employer.id}
                    style={{
                        maxWidth: '100%',
                        backgroundColor: employer.position === 'Leader' ? '#a1ffff' : '',
                    }}
                    closable={true}
                    closeIcon={<ExpandAltOutlined onClick={onUserClick}/>}
                >
                    {employer.firstName} {employer.lastName}
                </Tag>
            );
        });
    };

    return (
        <Card title={<Divider>Tomorrow {tomorrowDate}</Divider>}>
            <Row gutter={4} justify={"center"} wrap={true}>
                <Col style={{minWidth: "200px", marginTop: 4}} span={8}>
                    <Card>
                        <Statistic prefix={<SunOutlined/>} title="Day" value={dayResult.length}/>
                        {renderList('Day Shift', dayResult)}
                    </Card>
                </Col>
                <Col style={{minWidth: "200px", marginTop: 4}} span={8}>
                    <Card>
                        <Statistic prefix={<MoonOutlined/>} title="Night" value={nightResult.length}/>
                        {renderList('Night Shift', nightResult)}
                    </Card>
                </Col>
                <Col style={{minWidth: "200px", marginTop: 4}} span={8}>
                    <Card>
                        <Statistic prefix={<SmileOutlined/>} title="Day Off" value={dayOffResult.length}/>
                        {renderList('Day Shift', dayOffResult)}
                    </Card>
                </Col>
            </Row>
        </Card>
    );
};

export default TodayWork;
