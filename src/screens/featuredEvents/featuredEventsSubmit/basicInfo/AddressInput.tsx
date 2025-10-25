import { View, Text, TextInput } from 'react-native'
import React from 'react'
import GooglePlacesTextInput from 'react-native-google-places-textinput';
import styles from '../../../../utils/styles/shadow';
import colours from '../../../../utils/styles/colours';


interface EventDataProps {
    title: string;
    description: string;
    price: string;
    location: string;
    date: Date;
    quantity: string | null;
}

interface AddressInputProps {
    address: string;
    setEventData: React.Dispatch<React.SetStateAction<EventDataProps>>;
}

const AddressInput: React.FC<AddressInputProps> = ({
    address,
    setEventData
}) => {
    const handlePlaceSelect = (value: string) => {
        console.log('Place :', value)
        setEventData((prevData: EventDataProps) => ({
            ...prevData,
            location: value.replace(', UK', '')
        }))
    };
    return (
        <View className='border'>

            <Text className='font-semibold mt-3 px-5'>
                Location
                <Text className='text-red-400'> *  </Text>
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
                value={address}
                placeHolderText={'Enter a location'}
                detailsFields={['formattedAddress', 'location', 'viewport']}
                onPlaceSelect={(place) => handlePlaceSelect(place?.details?.formattedAddress)}
            />
        </View>
    )
}

export default AddressInput