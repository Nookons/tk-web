import React, { useEffect, useState, useMemo, useCallback } from 'react';
import { useLocation } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../../firebase';
import {
    Badge,
    Descriptions,
    DescriptionsProps,
    message,
    Row,
    Col,
    Button,
    Menu,
    Spin
} from 'antd';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';
import { IEmployer } from '../../types/Employer';
import { useShiftsForEmployer } from '../../hooks/useShiftsForEmployer';

dayjs.extend(relativeTime);

const Employer: React.FC = () => {
    const location = useLocation();
    const user_id = useMemo(() => new URLSearchParams(location.search).get('id'), [location.search]);
    const [currentEmployer, setCurrentEmployer] = useState<IEmployer | null>(null);
    const [loading, setLoading] = useState(true);
    const shifts = useShiftsForEmployer(user_id || undefined);

    const fetchEmployer = useCallback(async () => {
        if (!user_id) {
            message.error('No user ID provided');
            return;
        }

        try {
            const docRef = doc(db, 'employers', user_id);
            const docSnap = await getDoc(docRef);

            if (docSnap.exists()) {
                const employerData = docSnap.data() as IEmployer;
                setCurrentEmployer(employerData);
            } else {
                message.error('No such document found');
            }
        } catch (error) {
            message.error('Error fetching document');
        } finally {
            setLoading(false);
        }
    }, [user_id]);

    useEffect(() => {
        fetchEmployer();
    }, [fetchEmployer]);



    const items: DescriptionsProps['items'] = useMemo(() => [
        {
            key: 'position',
            label: 'Position',
            children: <Badge status="success" text={currentEmployer?.position || 'N/A'} />,
            span: 1,
        },
        {
            key: 'residentCard',
            label: 'Resident Card',
            children: <Badge status="processing" text={currentEmployer?.residentCard ? 'Have' : `Don't have`} />,
            span: 1,
        },
        {
            key: 'businessTrip',
            label: 'Business Trip',
            children: currentEmployer?.businessTrip ? 'Yes' : 'No',
            span: 1,
        },
        {
            key: 'address',
            label: 'Address',
            children: currentEmployer?.address || 'N/A',
            span: 3,
        },
        {
            key: 'residentCardTo',
            label: 'Resident Card To',
            children: currentEmployer?.residentCardDates
                ? `${dayjs(currentEmployer.residentCardDates[1]).format('YYYY-MM-DD')} (${dayjs(currentEmployer.residentCardDates[1]).fromNow()})`
                : 'N/A',
            span: 2,
        },
        {
            key: 'residentCardFrom',
            label: 'Resident Card From',
            children: currentEmployer?.residentCardDates
                ? `${dayjs(currentEmployer.residentCardDates[0]).format('YYYY-MM-DD')} (${dayjs(currentEmployer.residentCardDates[0]).fromNow()})`
                : 'N/A',
            span: 2,
        },
        {
            key: 'contractTo',
            label: 'Contract Validity To',
            children: currentEmployer?.contractDates
                ? `${dayjs(currentEmployer.contractDates[1]).format('YYYY-MM-DD')} (${dayjs(currentEmployer.contractDates[1]).fromNow()})`
                : 'N/A',
            span: 2,
        },
        {
            key: 'contractFrom',
            label: 'Contract Validity From',
            children: currentEmployer?.contractDates
                ? `${dayjs(currentEmployer.contractDates[0]).format('YYYY-MM-DD')} (${dayjs(currentEmployer.contractDates[0]).fromNow()})`
                : 'N/A',
            span: 2,
        },
        {
            key: 'phone',
            label: 'Phone',
            children: currentEmployer?.phone || 'N/A',
            span: 2,
        },
        {
            key: 'country',
            label: 'Country',
            children: currentEmployer?.country || 'N/A',
            span: 2,
        },
        {
            key: 'birthdayDate',
            label: 'Birthday Date',
            children: currentEmployer?.birthdayDate
                ? `${dayjs(currentEmployer.birthdayDate).format('YYYY-MM-DD')} | ${dayjs(currentEmployer.birthdayDate).fromNow()}`
                : 'N/A',
            span: 2,
        },
    ], [currentEmployer]);

    const menu = (
        <Menu>
            <Menu.Item key="1">
                <Button type="link">Change password</Button>
            </Menu.Item>
            <Menu.Item key="2">
                <Button type="link">Edit Profile</Button>
            </Menu.Item>
            <Menu.Item key="3">
                <Button type="link" danger>Logout</Button>
            </Menu.Item>
        </Menu>
    );

    if (loading) {
        return <Spin tip="Loading..." />;
    }

    if (!currentEmployer) {
        return <div>No employer data available</div>;
    }

    return (
        <div style={{ padding: '20px' }}>
            <Row gutter={[16, 16]}>
                <Col span={24}>
                    <Descriptions
                        title={`${currentEmployer.firstName} ${currentEmployer.lastName}`}
                        layout="horizontal"
                        bordered
                        items={items}
                    />
                </Col>
                <Col span={24}>

                </Col>
            </Row>
        </div>
    );
};

export default Employer;
