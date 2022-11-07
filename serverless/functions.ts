import type { AWS } from "@serverless/typescript";

const functions: AWS["functions"] = {
  setReminder: {
    handler: "src/functions/setReminder/index.handler",
    events: [
      {
        httpApi: {
          method: "post",
          path: "/",
        },
      },
    ],
  },
  sendReminder: {
    handler: "src/functions/sendReminder/index.handler",
    events: [
      {
        stream: {
          type: "dynamodb",
          arn: {
            "Fn::GetAtt": ["reminderTable", "StreamArn"],
          },
          fitlerPatterns: [
            {
              eventName: ["REMOVE"],
            },
          ],
        },
      },
    ],
  },
};

export default functions;
