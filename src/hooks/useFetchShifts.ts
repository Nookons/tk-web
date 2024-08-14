import {useEffect, useState} from "react";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../firebase";
import {IShift, IShiftData} from "../types/Shifts";

export const useFetchShifts= () => {
    const [shifts, setShifts] = useState<IShiftData[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'shifts'));  // Замените 'employees' на ваше имя коллекции
                const shiftsData = querySnapshot.docs.map(doc => ({ ...doc.data() as IShiftData }));
                setShifts(shiftsData);
            } catch (err) {
                setError('Failed to fetch employees');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    return { shifts, loading, error };
};