import React from "react";
import { View, Text } from "react-native";

const SimpleCheckbox = ({ label, checked }: { label: string, checked:boolean }) => {
  // const [checked, setChecked] = useState(false);

  return (
    <View
      className="flex-row items-center mb-3"
    >
      <View
        className={`w-6 h-6 rounded border-2 mr-3 ${
          checked ? "bg-green-500 border-green-500" : "border-gray-400"
        }`}
      >
        {checked && (
          <Text className="text-white text-center">✓</Text>
        )}
      </View>
      <Text className="text-base">{label}</Text>
    </View>
  );
};

export default SimpleCheckbox;
