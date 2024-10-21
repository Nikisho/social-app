import React from 'react';
import { Platform } from 'react-native';
import { BannerAd, BannerAdSize } from 'react-native-google-mobile-ads';

const adUnitId = Platform.select({
    ios: 'ca-app-pub-8692182271223423/1529333034', // Your iOS Ad Unit ID
    android: 'ca-app-pub-8692182271223423/1146189650', // Your Android Ad Unit ID
});

const GoogleAds = () => {

    return (
        <>
            <BannerAd
                unitId={adUnitId!}
                size={BannerAdSize.FULL_BANNER}
                requestOptions={{ requestNonPersonalizedAdsOnly: true }}
            />
        </>
    )
}

export default GoogleAds