import { NavigationProp } from '@react-navigation/native';

export const handleUrl = (url: string, navigation: NavigationProp<any>) => {
    try {
        // Fix the URL if needed (replace `#` with `?`)
        const fixedUrl = url.replace('#', '?');

        // Parse the incoming URL
        const parsedUrl = new URL(fixedUrl);
        const params = new URLSearchParams(parsedUrl.search);

        // Extract the necessary parameters from the query string
        const accessToken = params.get('access_token');
        const refreshToken = params.get('refresh_token');
        const type = params.get('type');

        // Navigate to the appropriate screen based on the `type` parameter
        if (type === 'recovery' && accessToken && refreshToken) {
            navigation.navigate('resetpassword', {
                access_token: accessToken,
                refresh_token: refreshToken,
            });
        }
    } catch (error) {
        console.error('Error handling URL:', error);
    }
};
