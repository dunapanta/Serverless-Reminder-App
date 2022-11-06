import { formatJSONResponse } from "@libs/apiGateway";
import { dynamo } from "@libs/dynamo";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const tableName = process.env.urlTable;
    const { code } = event.pathParameters || {};
    if (!code) {
      return formatJSONResponse({
        statusCode: 400,
        data: { message: "Missing code" },
      });
    }

    const record = await dynamo.get(code, tableName);
    const originalUrl = record.originalUrl;

    return formatJSONResponse({
      statusCode: 301,
      data: {},
      headers: {
        Location: originalUrl,
      },
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
