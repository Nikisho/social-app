
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          stripe_customer_id: string | null
        }
        Insert: {
          id: string
          stripe_customer_id?: string | null
        }
        Update: {
          id?: string
          stripe_customer_id?: string | null
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in string]: string
    }
    Enums: {
      [_ in never]: never
    }
  }
}

export interface PaymentIntentParamsProps {
      amount: number,
      currency: string,
      customer: string,
      automatic_payment_methods: {
        enabled: boolean,
      },
      transfer_data?: {
        destination: string,
      },
      application_fee_amount?: number,
      metadata: {
        user_id: string,
        featured_event_id: string,
        organizer_id: string,
        date: string,
        tickets_sold: string,
        chat_room_id: string,
        ticket_type_id: string
      },
}
