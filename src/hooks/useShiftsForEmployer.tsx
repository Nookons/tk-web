import {useEffect, useState} from "react";
import {collection, doc, getDoc, getDocs} from "firebase/firestore";
import {db} from "../firebase";
import {IShift, IShiftData} from "../types/Shifts";

export const useShiftsForEmployer = (id: string | undefined) => {
    const [shifts, setShifts] = useState<IShiftData | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchShifts = async () => {
            if (id) {
                try {
                    const docRef = doc(db, 'shifts', id.toString());
                    const docSnap = await getDoc(docRef);

                    if (docSnap.exists()) {
                        setShifts(docSnap.data() as IShiftData);
                    }
                } catch (err) {
                    setError('Failed to fetch employees');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchShifts();
    }, []);

    return { shifts, loading, error };
};