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
