
export interface IEmployer {
    id: number;
    address: string;
    birthdayDate: number;
    businessTrip: boolean;
    contractFrom: number;
    contractValidity: number;
    country: string;
    driverLicense: boolean;
    firstName: string;
    lastName: string;
    phone: number;
    position: string;
    residentCard: boolean | "in progress";
    residentCardValidity: number;
    scissorLiftLicense: boolean;
}