

export interface IShift {
    date: number;
    type: 'Day' | 'Night';
}

export interface IShiftData {
    shifts: IShift[];
    update_time?: number;
    employer?: number;
}