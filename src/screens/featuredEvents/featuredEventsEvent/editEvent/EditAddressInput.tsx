import { View, Text } from 'react-native'
import React from 'react'
import GooglePlacesTextInput from 'react-native-google-places-textinput';
import colours from '../../../../utils/styles/colours';
import { EventDataProps } from '../../../../utils/types/types';


interface EditAddressInputProps {
    address: string;
    setEventData: React.Dispatch<React.SetStateAction<EventDataProps | null>>;
}
const EditAddressInput = ({
    address,
    setEventData
}: EditAddressInputProps) => {
        const handlePlaceSelect = (value: string) => {
        console.log('Place :', value)
        setEventData((prevData: EventDataProps | null) => {
            if (!prevData) return null;
            return {
                ...prevData,
                location: value.replace(', UK', '')
            };
        });
    };
  return (
    <View style={{
        borderWidth: 1,
        borderColor: '#E0E0E0',
        marginBottom: 16,
        borderRadius: 8,
        marginVertical: 10
    }}>
            <Text className='font-semibold mt-2 px-5'>
                Location
            </Text>
            <GooglePlacesTextInput
                style={{
                    input: {
                        backgroundColor: colours.primaryColour,
                        borderWidth: 0,
                        marginHorizontal: 5
                    },
                    placeholder: {
                        color: '#9E9E9E',
                    },
                }}
                apiKey={process.env.EXPO_PUBLIC_GOOGLE_PLACES_API_KEY!}
                fetchDetails={true}
                scrollEnabled={true}
                value={address}
                placeHolderText={'Enter a location'}                
                detailsFields={['formattedAddress', 'location', 'viewport']}
                onPlaceSelect={(place) => handlePlaceSelect(place?.details?.formattedAddress)}
            />
    </View>
  )
}

export default EditAddressInput