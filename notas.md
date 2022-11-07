## Reminder App Clase 1 - Repo Setup

- En dynamoResources se agrega un nuevo atributo Time To Live (TTL), lo que permite que los items se borren automáticamente después de cierto tiempo.

```
TimeToLiveSpecification: {
        AttributeName: "ttl",
        Enabled: true,
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
- Tambien se puede especificat `batchSize` es util si ocurre multiples veces en un minuto o en un segundo se puede decir enviame 10 eventos  lo cual es mas eficiente que tener lambdas separadas o que envie uno a la vez
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
