import { DynamoDBClient } from "@aws-sdk/client-dynamodb";
import {
  GetCommand,
  GetCommandInput,
  PutCommand,
  PutCommandInput,
} from "@aws-sdk/lib-dynamodb";

//default region where lambda is deploying
const dynamoClient = new DynamoDBClient({});
export const dynamo = {
  write: async (data: Record<string, any>, tableName: string) => {
    const params: PutCommandInput = {
      TableName: tableName,
      Item: data,
    };
    const command = new PutCommand(params);

    //const res = await dynamoClient.send(command);
    //console.log("DynamoDb res:", res);
    await dynamoClient.send(command);

    return data;
  },
  get: async (id: string, tableName: string) => {
    const params: GetCommandInput = {
      TableName: tableName,
      Key: {
        id,
      },
    };
    const command = new GetCommand(params);
    const response = await dynamoClient.send(command);

    return response.Item;
  },
};
