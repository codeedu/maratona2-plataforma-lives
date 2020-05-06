export enum LiveStatus {
    PENDING = 'pending',
    DONE = 'done'
}

export interface Live{
    id: string;
    title: string;
    description: string;
    date: string;
    slug: string;
    status: LiveStatus;
}
