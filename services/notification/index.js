import { notification } from "../../utils/helper";

export function sendToNotificationServer(
  message = {
    to: [], //notificationTokenSet
    title: null,
    body: null,
    data: {},
    subtitle: null,
    sound: "default",
    badge: 0,
    channelId: null,

    priority: "default",
    ttl: null,
    expiration: null,
  }
) {
  return new Promise((resolve, reject) => {
    notification
      .sendToNotificationServer(message)
      .then((result) => {
        return resolve(result);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export default { sendToNotificationServer }
