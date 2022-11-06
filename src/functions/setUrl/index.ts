import { formatJSONResponse } from "@libs/apiGateway";
import { dynamo } from "@libs/dynamo";
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import { v4 as uuid } from "uuid";

export const handler = async (
  event: APIGatewayProxyEvent
): Promise<APIGatewayProxyResult> => {
  try {
    const body = JSON.parse(event.body);
    const tableName = process.env.urlTable;
    const baseUrl = process.env.baseUrl;
    const originalUrl = body.url;
    const code = uuid().slice(0, 8);

    const shortUrl = `${baseUrl}/${code}`;

    const data = {
      id: code,
      shortUrl,
      originalUrl,
    };

    await dynamo.write(data, tableName);

    return formatJSONResponse({
      data: { shortUrl, originalUrl },
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
