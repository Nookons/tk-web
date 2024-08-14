import {useEffect, useState} from "react";
import {IEmployer} from "../types/Employer";
import {doc, getDoc} from "firebase/firestore";
import {db} from "../firebase";

export const useFetchEmployer = (id: number | undefined) => {
    const [employer, setEmployer] = useState<IEmployer | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            if (id) {
                try {
                    const employerRef = doc(db, "employers", id.toString());
                    const docSnap = await getDoc(employerRef);

                    if (docSnap.exists()) {
                        setEmployer(docSnap.data() as IEmployer);
                    } else {
                        // docSnap.data() will be undefined in this case
                        console.log("No such document!");
                    }
                } catch (err) {
                    setError('Failed to fetch employees');
                } finally {
                    setLoading(false);
                }
            }
        };

        fetchEmployees();
    }, []);

    return { employer, loading, error };
};