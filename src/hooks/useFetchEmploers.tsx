import {useEffect, useState} from "react";
import {collection, getDocs} from "firebase/firestore";
import {db} from "../firebase";
import {IEmployer} from "../types/Employer";

export const useFetchEmployees = () => {
    const [employees, setEmployees] = useState<IEmployer[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const fetchEmployees = async () => {
            try {
                const querySnapshot = await getDocs(collection(db, 'employers'));  // Замените 'employees' на ваше имя коллекции
                const employeeList = querySnapshot.docs.map(doc => ({ ...doc.data() as IEmployer }));
                setEmployees(employeeList);
            } catch (err) {
                setError('Failed to fetch employees');
            } finally {
                setLoading(false);
            }
        };

        fetchEmployees();
    }, []);

    return { employees, loading, error };
};