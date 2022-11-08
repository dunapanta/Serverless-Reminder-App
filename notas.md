## Reminder App Clase 1 - Repo Setup

- En dynamoResources se agrega un nuevo atributo Time To Live (TTL), lo que permite que los items se borren automáticamente después de cierto tiempo.

```
TimeToLiveSpecification: {
        AttributeName: "ttl",
        Enabled: true,
      },
```

- En `dynamoResources.ts`

```
StreamSpecification: {
        StreamViewType: "OLD_IMAGE",
      },
```

## Reminder App Clase 7 - Define data to save in DynamoDB

```
const data = {
      ...body,
      id: uuid(),
      TTL: reminderDate / 1000, //TTL dynamo is in seconds
      pk: userId, //group by user
      sk: reminderDate.toString(), //sort by date
    };
```

## Reminder App Clase 9 -Add stream to DynamoDB

- Cuando se elimina un item de la tabla, se dispara un evento en el stream para ejecutar una función lambda.
- Para activar stream en DynamoDB se agrega una nueva propiedad en `dynamoResources`
- Cada vez que se hace deploy hara match con arn
- Específico solo para eventos `REMOVE`
- Tambien se puede especificat `batchSize` es util si ocurre multiples veces en un minuto o en un segundo se puede decir enviame 10 eventos lo cual es mas eficiente que tener lambdas separadas o que envie uno a la vez

```
sendReminder:{
    handler: "src/functions/sendReminder/index.handler",
    events: [
      {
        stream:{
          type: "dynamodb",
          arn: {
            "Fn::GetAtt": ["reminderTable", "StreamArn"],
          },
          fitlerPatterns: [
            {
              eventName: ["REMOVE"],
            },
          ],
        }
      }
    ]
  }
```

## Reminder App Clase 10 - Reminder endpoint

- Es necesario utilizar `unmarshall` para convertir el objeto a JSON porque en dynamoDB se guarda diferente con el tipo de dato
- Ejecutar `npm i @aws-sdk/util-dynamodb`
- Se importa `unmarshall` de `@aws-sdk/util-dynamodb`

## Reminder App Clase 11 - SES and SNS setup

- Se puede usar un sandbox para probar los servicios a nosotros mismos
- Se agrega el correo en SES y el telefono en SNS

## Reminder App Clase 12 - Send SMS and Send Email functions

- Email
- Ejecutar `npm i -S @aws-sdk/client-ses`

```
const sendEmail = async ({
  email,
  reminder,
}: {
  email: string;
  reminder: string;
}) => {
  const params: SendEmailCommandInput = {
    Source: "source.@email.com",
    Destination: {
      ToAddresses: [email],
    },
    Message: {
      Body: {
        Text: {
          Charset: "UTF-8",
          Data: reminder,
        },
      },
      Subject: {
        Charset: "UTF-8",
        Data: "Reminder!!",
      },
    },
  };
  const command = new SendEmailCommand(params);

  const res = await sesClient.send(command);

  return res.MessageId;
};
```

- SMS
- Ejecutar `npm i -S @aws-sdk/client-sns`

```
const sendSMS = async ({
  phoneNumber,
  reminder,
}: {
  phoneNumber: string;
  reminder: string;
}) => {
  const params: PublishCommandInput = {
    Message: reminder,
    PhoneNumber: phoneNumber,
  };
  const command = new PublishCommand(params);

  const res = await snsClient.send(command);

  return res.MessageId;
};
```

## Reminder App Clase 13 - Deploy and permissions

- Para agregar permisos a lambdas
- Ejecutar `npm i -D serverless-iam-roles-per-function`
- Este plugin permite agregar permisos a cada función definiendo `iamRoleStatements`

```
 //@ts-expect-error
    iamRoleStatements: [
      {
        Effect: "Allow",
        Action: ["ses:SendEmail", "sns:Publish"],
        Resource: "*",
      },
    ],
```

## Reminder App Clase 14 - DynamoDB Secondary Index

- En `dynamoResources.ts` en `AtributesDefinitions` se agrega
  ```
        {
          AttributeName: "pk",
          AttributeType: "S",
        },
        {
          AttributeName: "sk",
          AttributeType: "S",
        },
  ```
- En `GlobalSecondaryIndexes` se agrega
  ```
        GlobalSecondaryIndexes: [
        {
          IndexName: "index1",
          KeySchema: [
            {
              AttributeName: "pk",
              KeyType: "HASH",
            },
            {
              AttributeName: "sk",
              KeyType: "RENGE",
            },
          ],
          Projection: {
            ProjectionType: "ALL",
          }
        },
      ],
  ```
  - Se necesita especificar los permisos para los indeces de la tabla en `serverless.ts`
  ```
  iamRoleStatements: [
      {
        Effect: "Allow",
        Action: "dynamodb:*",
        Resource: [
          "arn:aws:dynamodb:${self:provider.region}:${aws:accountId}:table/${self:custom.reminderTable}",
          "arn:aws:dynamodb:${self:provider.region}:${aws:accountId}:table/${self:custom.reminderTable}/index/index1",
        ],
      },
    ],
  ```
