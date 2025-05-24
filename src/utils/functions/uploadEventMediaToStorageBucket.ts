import { decode } from "base64-arraybuffer";
import { supabase } from "../../../supabase";

export const uploadEventMediaToStorageBucket = async (file: string, unique_file_identifier: string, organizer_id: number) => {
    const arrayBuffer = decode(file);
    const link = `${organizer_id}/${unique_file_identifier}.jpg`
    try {
        const { error } = await supabase
            .storage
            .from('featured-events')
            .upload(`${link}`, arrayBuffer, {
                contentType: 'image/png',
                upsert: true,
            });
        if (error) {
            console.error('Upload error:', error.message);
        }
        return link;

    } catch (error) {
        console.error('Conversion or upload error:', error);
    }
};