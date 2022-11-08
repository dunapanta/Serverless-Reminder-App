import { formatJSONResponse } from "@libs/apiGateway";
import { dynamo } from "@libs/dynamo";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuid } from "uuid";

import { isValidEmail } from "utils/validations";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const tableName = process.env.reminderTable;

    const { userId } = event.pathParameters || {};

    if (!userId) {
      return formatJSONResponse({
        statusCode: 400,
        data: { message: "userId is required" },
      });
    }

    const data = await dynamo.query({
      tableName,
      index: "index1",
      pkValue: userId,
    });

    return formatJSONResponse({
      data,
    });
  } catch (err) {
    return formatJSONResponse({
      statusCode: 500,
      data: {
        error: err.message,
      },
    });
  }
};

const validateInputs = ({
  email,
  phoneNumber,
  reminder,
  reminderDate,
}: {
  email?: string;
  phoneNumber?: string;
  reminder: string;
  reminderDate: number;
}) => {
  if (!email && !phoneNumber) {
    return formatJSONResponse({
      statusCode: 400,
      data: { message: "Email or Phone Number are required" },
    });
  }

  if (email && !isValidEmail(email)) {
    return formatJSONResponse({
      statusCode: 400,
      data: { message: "Invalid email" },
    });
  }

  if (!reminder) {
    return formatJSONResponse({
      statusCode: 400,
      data: { message: "Reminder is required" },
    });
  }

  if (!reminderDate) {
    return formatJSONResponse({
      statusCode: 400,
      data: { message: "Reminder Date is required" },
    });
  }

  return;
};
