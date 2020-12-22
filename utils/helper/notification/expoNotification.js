var fetch = require("node-fetch");

//Expo Notification Server
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
  if (!message.ttl) {
    delete message["ttl"];
  }
  if (!message.expiration) {
    delete message["expiration"];
  }
  if (!message.subtitle) {
    delete message["subtitle"];
  }
  if (!message.channelId) {
    delete message["channelId"];
  }

  message = JSON.stringify(message);

  return new Promise((resolve, reject) => {
    fetch("https://exp.host/--/api/v2/push/send", {
      method: "POST",
      headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
        "accept-encoding": "gzip, deflate",
        host: "exp.host",
      },
      body: message,
    })
      .then(async (response) => {
        const responseJson = await response.json();
        return resolve(responseJson);
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export function validateToken(
  notificationToken = [],
  notificationResult = {
    data: [{ id: null, status: "ok" }],
    errors: [
      {
        code: null,
        message: null,
      },
    ],
  }
) {
  const unregisterToken = [];
  console.log("validateToken");
  if (notificationResult.errors) {
    throw notificationResult;
  }

  if (!Array.isArray(notificationResult.data) || notificationResult.data.length === 0) {
    throw new Object({ code: "Notification error", message: "No Responses Return." });
  }

  notificationResult.data.forEach((result, index) => {
    if (result.status === "error") {
      if (result.details.error === "DeviceNotRegistered") {
        unregisterToken.push(notificationToken[index]);
      }
    }
  });

  return unregisterToken;
}
