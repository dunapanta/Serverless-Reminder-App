import { DynamoDBStreamEvent } from "aws-lambda";
import { unmarshall } from "@aws-sdk/util-dynamodb";
import { AttributeValue } from "@aws-sdk/client-dynamodb";

export const handler = async (event: DynamoDBStreamEvent) => {
  try {
    const reminderPromises = event.Records.map(async (record) => {
      const data = unmarshall(
        record.dynamodb.OldImage as Record<string, AttributeValue>
      );

      const { email, phoneNumber, reminder } = data;
      if (phoneNumber) {
        //send sms
        await sendSMS({ phoneNumber, reminder });
      }
      if (email) {
        //send email
        await sendEmail({ email, reminder });
      }
    });
    
    await Promise.all(reminderPromises);
  } catch (err) {}
};
