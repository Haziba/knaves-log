using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiFunction
{
    class EventSaver
    {
        public async static Task NewLog(Log_V1 log, ILogger<ToUpperStringRequestResponseHandler> _logger)
        {
            var client = new AmazonDynamoDBClient();

            var eventItem = new Dictionary<string, AttributeValue>
            {
                ["model_version"] = new AttributeValue
                {
                    N = "1"
                },
                ["when"] = new AttributeValue
                {
                    S = DateTime.UtcNow.ToString("o")
                },
                ["event"] = new AttributeValue
                {
                    S = "LOG_CREATED",
                },
                ["body"] = new AttributeValue
                {
                    S = JsonConvert.SerializeObject(log)
                }
            };

            _logger.LogInformation("Event item! - " + JsonConvert.SerializeObject(eventItem));

            await client.PutItemAsync(new PutItemRequest
            {
                TableName = "kl-events",
                Item = eventItem
            });
        }
    }
}
