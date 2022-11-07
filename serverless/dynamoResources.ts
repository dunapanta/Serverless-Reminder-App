import type { AWS } from "@serverless/typescript";

const dynamoResources: AWS["resources"]["Resources"] = {
  reminderTable: {
    Type: "AWS::DynamoDB::Table",
    Properties: {
      TableName: "${self:custom.reminderTable}",
      AttributeDefinitions: [
        {
          AttributeName: "id",
          AttributeType: "S",
        },
      ],
      KeySchema: [
        {
          AttributeName: "id",
          KeyType: "HASH",
        },
      ],
      BillingMode: "PAY_PER_REQUEST",

      StreamSpecification: {
        StreamViewType: "OLD_IMAGES",
      },

      TimeToLiveSpecification: {
        AttributeName: "TTL",
        Enabled: true,
      },
    },
  },
};

export default dynamoResources;
