import { View, InputAccessoryView, Button, StyleSheet, Keyboard } from 'react-native'
import React from 'react'

const DoneKeyboardCloseButton = ({ inputAccessoryViewID }: { inputAccessoryViewID: string }) => (
  <InputAccessoryView nativeID={inputAccessoryViewID}>
    <View style={styles.accessory}>
      <Button title="Done" onPress={Keyboard.dismiss} />
    </View>
  </InputAccessoryView>
)

export default DoneKeyboardCloseButton

const styles = StyleSheet.create({
  accessory: {
    backgroundColor: '#f7f7f7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    alignItems: 'flex-end',
  },
})