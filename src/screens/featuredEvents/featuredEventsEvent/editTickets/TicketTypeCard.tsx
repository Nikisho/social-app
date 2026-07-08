import { View, Text, TouchableOpacity } from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import formatDateShortWeekday from "../../../../utils/functions/formatDateShortWeekday";
import extractTimeFromDate from "../../../../utils/functions/extractTimeFromDate";
import extractTimeFromDateSubmit from "../../../../utils/functions/extractTimeFromDateSubmit";
import { useState } from "react";
import DeleteTicketModal from "./DeleteTicketModal";
import { supabase } from "../../../../../supabase";
// import dayjs from "dayjs";

type TicketType = {
  ticket_type_id: number;
  name: string;
  description: string;
  price: string;
  currency_code: string;
  quantity: number;
  tickets_sold: number;
  is_free: boolean;
  is_active: boolean;
  sales_start: string;
  sales_end: string;
};

type Props = {
  ticket: TicketType;
  onEdit: (ticket: TicketType) => void;
  fetchTicketTypes: () => void;
};

export default function TicketTypeCard({
  ticket,
  onEdit,
  fetchTicketTypes,
}: Props) {
  const remaining = ticket.quantity - ticket.tickets_sold;
  const [openDeleteModal, setOpenDeleteModal] = useState<boolean>(false);
  const handleDelete = async (ticket_type_id: number) => {
    try {
      // Call your delete function here, e.g., API call to delete the ticket type
      console.log(`Deleting ticket type with ID: ${ticket_type_id}`);

      const { error } = await supabase
        .from("ticket_types")
        .delete()
        .eq("ticket_type_id", ticket_type_id)

      if (error) {
        console.error("Error deleting ticket type:", error);
        return;
      }
      setOpenDeleteModal(false);
      fetchTicketTypes();
    } catch (error) {
      console.error("Error deleting ticket type:", error);
    }
    finally { 
      // Refresh the ticket types list after deletion
      setOpenDeleteModal(false);
      fetchTicketTypes();
    }
  };


  return (
    <>
      <TouchableOpacity
        activeOpacity={0.9}
        onPress={() => onEdit(ticket)}
        className="bg-white rounded-3xl p-5 mb-4 border border-zinc-200"
      >
        {/* Top row */}
        <View className="flex-row justify-between items-start">
          <View className="flex-1 pr-3">
            <Text className="text-lg font-semibold text-zinc-900">
              {ticket.name}
            </Text>

            {!!ticket.description && (
              <Text className="text-zinc-500 mt-1">
                {ticket.description}
              </Text>
            )}
          </View>

          <View className="items-end">
            <Text className="text-xl font-bold text-black">
              {ticket.is_free
                ? "Free"
                : `£${ticket.price}`}
            </Text>

            <View
              className={`mt-2 px-3 py-1 rounded-full ${ticket.is_active
                ? "bg-green-100"
                : "bg-zinc-100"
                }`}
            >
              {/* <Text
              className={`text-xs font-medium ${
                ticket.is_active
                  ? "text-green-700"
                  : "text-zinc-500"
              }`}
            >
              {ticket.is_active ? "Active" : "Inactive"}
            </Text> */}
            </View>
          </View>
        </View>

        {/* Stats */}
        <View className="flex-row mt-5 gap-3">
          <Stat
            icon="confirmation-number"
            value={`${remaining}/${ticket.quantity}`}
            label="Remaining"
          />

          <Stat
            icon="shopping-cart"
            value={ticket.tickets_sold}
            label="Sold"
          />
        </View>

        {/* Dates */}
        <View className="mt- pt-4 border-t border-zinc-100">
          <Text className="text-xs text-zinc-500">
            Sales window
          </Text>

          <Text className="text-sm text-zinc-800 mt-1">
            {/* {dayjs(ticket.sales_start).format(
            "DD MMM YYYY • HH:mm"
          )} */}
            {formatDateShortWeekday(ticket.sales_start)} at {extractTimeFromDateSubmit(ticket.sales_start as unknown as Date)}

          </Text>

          <Text className="text-sm text-zinc-500">
            →{" "}
            {/* {dayjs(ticket.sales_end).format(
            "DD MMM YYYY • HH:mm"
          )} */}
            {formatDateShortWeekday(ticket.sales_end)} at {extractTimeFromDateSubmit(ticket.sales_end as unknown as Date)}

          </Text>
        </View>

        {/* CTA */}
        {/* Actions */}
        <View className="mt-5 flex-row justify-between items-center">

          <TouchableOpacity
            onPress={() => setOpenDeleteModal(true)}
            hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            className="flex-row items-center"
          >
            <MaterialIcons
              name="delete-outline"
              size={20}
              color="#dc2626"
            />

            <Text className="ml-1 text-sm font-medium text-red-600">
              Delete
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => onEdit(ticket)}
            className="flex-row items-center"
          >
            <Text className="text-sm font-medium text-violet-600">
              Edit ticket
            </Text>

            <MaterialIcons
              name="chevron-right"
              size={20}
              color="#7c3aed"
            />
          </TouchableOpacity>

        </View>
      </TouchableOpacity>
      <DeleteTicketModal
        modalVisible = {openDeleteModal}
        setVisible={(visible) => setOpenDeleteModal(visible)}
        onDelete={() => {
            handleDelete(ticket.ticket_type_id);
        }}
      />
    </>

  );
}

function Stat({
  icon,
  value,
  label,
}: {
  icon: keyof typeof MaterialIcons.glyphMap;
  value: string | number;
  label: string;
}) {
  return (
    <View className="flex-1 bg-zinc-50 rounded-2xl p-3">
      <MaterialIcons
        name={icon}
        size={18}
        color="#52525b"
      />

      <Text className="text-base font-semibold mt-2">
        {value}
      </Text>

      <Text className="text-xs text-zinc-500">
        {label}
      </Text>
    </View>
  );
}