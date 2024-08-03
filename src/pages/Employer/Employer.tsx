import React, {useEffect, useState} from 'react';
import {useLocation} from "react-router-dom";
import { doc, getDoc } from "firebase/firestore";
import {db} from "../../firebase";
import {Badge, Descriptions, DescriptionsProps, message} from "antd";
import dayjs from "dayjs";
import relativeTime from 'dayjs/plugin/relativeTime';

// Extend dayjs with the relativeTime plugin
dayjs.extend(relativeTime);

interface IEmployeeDetails {
    contract_from: number; // UNIX timestamp
    contract_validity: number; // UNIX timestamp
    phone: number; // Phone number
    scissor_lift_license: "yes" | "no"; // Boolean as a string
    address: string; // Address string
    position: string; // Job position
    birthday_date: number; // UNIX timestamp
    country: string; // Country code
    driver_license: "yes" | "no"; // Boolean as a string
    business_trip: "yes" | "no"; // Boolean as a string
    resident_card: "in progress" | "yes" | "no"; // Resident card status
    resident_card_validity: number; // UNIX timestamp or 0 if not valid
}

const Employer = () => {
    const location = useLocation();
    const first_name = new URLSearchParams(location.search).get('first_name');
    const last_name = new URLSearchParams(location.search).get('last_name');

    const [currentEmployer, setCurrentEmployer] = useState<IEmployeeDetails | null>(null);


    useEffect(() => {
        async function getEmployer () {
            if (first_name && last_name) {
                const path = first_name.toLocaleLowerCase() + "-" + last_name.toLocaleLowerCase();


                const docRef = doc(db, "employers", path);
                const docSnap = await getDoc(docRef);

                if (docSnap.exists()) {
                    message.success(`Has employers ${first_name} ${last_name}`);
                    setCurrentEmployer(docSnap.data() as IEmployeeDetails);
                } else {
                    message.error("No such document")
                }
            }
        }
        getEmployer();
    }, [first_name, last_name]);

    useEffect(() => {
        console.log(currentEmployer);
    }, [currentEmployer]);

    const items: DescriptionsProps['items'] = [
        {
            key: '1',
            label: 'Address',
            children: `${currentEmployer?.address}`,
        },
        {
            key: '2',
            label: 'Positon',
            children: <Badge status="processing" text={currentEmployer?.position} />,
        },
        {
            key: '3',
            label: 'country',
            children: `${currentEmployer?.country}`,
        },
        {
            key: '4',
            label: 'resident_card',
            children: `${currentEmployer?.resident_card}`,
            span: 2
        },
        {
            key: '4',
            label: 'resident_card_validity',
            children: `${currentEmployer?.resident_card_validity}`,
            span: 2
        },
        {
            key: '5',
            label: 'birthday_date',
            children: `${dayjs(currentEmployer?.birthday_date).format("YYYY-MM-DD")} ${dayjs(currentEmployer?.birthday_date).fromNow()}`,
        },
        {
            key: '6',
            label: 'phone',
            children: `${currentEmployer?.phone}`,
        },
        {
            key: '6',
            label: 'business_trip',
            children: `${currentEmployer?.business_trip}`,
        },
        {
            key: '6',
            label: 'contract_from',
            children: `${dayjs(currentEmployer?.contract_from).format("YYYY-MM-DD")} ${dayjs(currentEmployer?.contract_from).fromNow()}`,
        },
        {
            key: '6',
            label: 'contract_validity',
            children: `${currentEmployer?.contract_validity}`,
        },
    ];

    if (!currentEmployer) {
        return (
            <div>
                no
            </div>
        )
    }

    return (
        <Descriptions title={`${first_name}  ${last_name}`} layout="horizontal" bordered items={items} />
    );
};

export default Employer;