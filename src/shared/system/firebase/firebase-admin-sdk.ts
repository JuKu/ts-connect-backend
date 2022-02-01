import {firebaseAdmin} from "./admin-config";
import {messaging} from "firebase-admin";
import MessagingTopicResponse = messaging.MessagingTopicResponse;

/**
 * This firebase admin sdk class provides some helper functions for use
 * with Firebase.
 *
 * @author Justin Kuenzel
 */
export class FirebaseAdminSDK {
  /**
   * This method allows to send notifications to firebase topics.
   * See also: https://medium.com/@jullainc/firebase-push-notifications-to-mobile-devices-using-nodejs-7d514e10dd4
   *
   * @param {String} targetTopic
   * @param {String} title
   * @param {String} message
   * @param {any} data
   * @param {String?} collapseKey
   * @param {String} priority
   * @param {Number} ttl
   */
  public static sendTopicNotification(targetTopic: String, title: String,
      message: String, data: any = {}, collapseKey: String = undefined,
      priority: String = "high",
      ttl: number = 60 * 60 * 24 * 7): void {
    const notificationOptions = {
      "priority": priority,
      "timeToLive": ttl,
      // Used when sending messages to iOS devices. When set to true, the
      // app is woken on message receipt. This is the default behavior
      // for messages received on Android devices.
      "contentAvailable": true,
      "collapseKey": collapseKey,
    };

    const payload = {
      notification: {
        "title": title,
        "body": message,
      },
      data: data,
    };

    // send notification to firebase cloud messaging
    firebaseAdmin.messaging().sendToTopic(targetTopic, payload,
        notificationOptions).then((value: MessagingTopicResponse) => {
      const messageId = value.messageId;
      logger.info("sended notification successfully to topic: '" +
        targetTopic + "'",
      {
        "messageId": messageId,
        "targetTopic": targetTopic,
        "title": title,
        "message": message,
      });
    });
  }
}
