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
          filterPatterns: [
            {
              eventName: ["REMOVE"],
            },
          ],
        },
      },
    ],
    //@ts-expect-error
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["ses:SendEmail", "sns:Publish"],
        Resource: "*",
      },
    ],
  },
};

export default functions;
