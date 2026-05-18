export const getPricePlusPlatformFee = (
    price: number | string | null,
    platformFeeDiscountPct: number = 0
) => {
    if (price === null) return null;

    const numericPrice = Number(price);

    const baseFee = numericPrice * 0.03;

    const platformFee =
        baseFee * (1 - platformFeeDiscountPct / 100);

    return Number(
        (numericPrice + platformFee).toFixed(2)
    );
};