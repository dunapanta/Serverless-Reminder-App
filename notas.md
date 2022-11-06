## Reminder App Clase 1 - Repo Setup

- En dynamoResources se agrega un nuevo atributo Time To Live (TTL), lo que permite que los items se borren automáticamente después de cierto tiempo.
```
TimeToLiveSpecification: {
        AttributeName: "ttl",
        Enabled: true,
      },
```
