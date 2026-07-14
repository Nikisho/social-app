export type EventDataProps = {
    title: string;
    description: string;
    price: string;
    location: string;
    date: Date;
    end_datetime: Date;
    quantity: string | null;
    hide_participants?: boolean;
    userInterests?: {
        interestCode: number
        interestGroupCode: number
    }[],
    refund_policy_type_id: number | null;
};