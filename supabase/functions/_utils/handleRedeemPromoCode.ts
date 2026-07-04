import { supabaseAdmin } from "./supabase.ts";

export const handleRedeemPromoCode = async (promoCodeId: number) => {
    try {
        if (!promoCodeId) {
            return { success: true };
        }
        const { data, error } = await supabaseAdmin
            .from("promo_codes")
            .select("*")
            .eq("promo_code_id", promoCodeId)
            .single();

        if (error) {
            throw new Error(error.message);
        }

        if (!data) {
            throw new Error("Promo code not found");
        }

        if (!data.active) {
            throw new Error("Promo code is not active");
        }

        const redemptionCount = data.redemption_count ?? 0;
        if (
            data.quantity !== null &&
            redemptionCount >= data.quantity
        ) {
            throw new Error("Promo code has reached its usage limit");
        }

        // update the redemption count of the promo code if it's not null
        const { error: updateError } = await supabaseAdmin
            .from("promo_codes")
            .update({ redemption_count: redemptionCount + 1 })
            .eq("promo_code_id", data.promo_code_id);

        if (updateError) {
            throw new Error(updateError.message);
        }
        return { success: true };
    } catch (err: any) {
        console.error("Error redeeming promo code:", err.message);
        return {
            success: false,
            message: err.message,
        };
    }
};
