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
  getUrl:{
    handler: "src/functions/getUrl/index.handler",
    events: [
      {
        httpApi: {
          method: "get",
          path: "/{code}",
        }
      }
    ]
  }
};

export default functions;
