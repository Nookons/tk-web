import React, { FC, useEffect, useState } from 'react';
import { IShift } from "../../types/Shifts";
import dayjs from "dayjs";
import { useAppSelector } from "../../hooks/storeHooks";
import { useFetchShifts } from "../../hooks/useFetchShifts";
import {getUser} from "../../utils/getUser";

interface SwapScreenProps {
    shift: IShift
}

const SwapScreen: FC<SwapScreenProps> = ({ shift }) => {
    const user = useAppSelector(state => state.currentUser.user);
    const shiftsData = useFetchShifts();
    const [employers, setEmployers] = useState<any[]>([]); // State to store fetched employers

    useEffect(() => {
        const fetchEmployers = async () => {
            const employerData: any[] = [];
            for (const item of shiftsData.shifts) {
                if (item.employer && user && item.employer !== user.id) {
                    const worker = getUser(item.employer);
                    employerData.push(worker);
                }
            }
            setEmployers(employerData);
            console.log(employerData);
        };

        fetchEmployers();
    }, [user]);

    return (
        <div>
            <p>{dayjs(shift.date).format("YYYY-MM-DD HH:mm:ss")}</p>
            {/* Render employers or any other data as needed */}
        </div>
    );
};

export default SwapScreen;
