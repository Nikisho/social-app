const EXPO_PUSH_URL = "https://exp.host/--/api/v2/push/send";
export async function sendWinnerNotification(token: string, title: string, body: string) {
  if (!token.startsWith("ExponentPushToken")) {
    console.error("Invalid Expo push token:", token);
    return;
  }
  const message = {
    to: token,
    sound: "default",
    title,
    body,
  };

  try {
    const response = await fetch(EXPO_PUSH_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify([message]), // Expo API allows batch sending
    });

    const data = await response.json();
    console.log("Expo Push Response:", data);
  } catch (error) {
    console.error("Error sending push notification:", error);
  }
}
