// Transport Data Interfaces

export interface Transport {
    id: string;
    name: string;
    type: string;
    capacity: number;
    available: boolean;
}

export interface TransportSchedule {
    transportId: string;
    day: string;
    startTime: string;
    endTime: string;
}

export interface TransportBooking {
    id: string;
    transportId: string;
    userId: string;
    bookingDate: string;
    status: string;
}