import { supabase } from "../../../supabase"

export const recordTransaction = async(
    transaction_amount: string,
    transaction_package: string,
    transaction_date_time: string,
    transaciton_user_uid: string,
    transaction_identifier: string,
    transaction_currency: string
) => {
    const { error } = await supabase
        .from('transactions')
        .insert({
            pack: transaction_package,
            amount: transaction_amount, 
            created_at: transaction_date_time,
            user_uid: transaciton_user_uid,
            transaction_id: transaction_identifier,
            currency: transaction_currency
        })
    if (error) {
        console.error(error.message)
    }
}