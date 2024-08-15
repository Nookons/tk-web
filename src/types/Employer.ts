interface IEmployerShift {
    day: number;
    time: string;
    type: string;
}

export interface IEmployer {
    id: number;
    address: string;
    access_level: string;
    birthdayDate: number;
    businessTrip: boolean;
    contractDates: number[];
    forkLiftLicense: boolean;
    country: string;
    driverLicense: boolean;
    firstName: string;
    lastName: string;
    phone: number;
    position: string;
    residentCard: boolean;
    residentCardDates: number[];
    work_days: IEmployerShift[];
    scissorLiftLicense: boolean;
}