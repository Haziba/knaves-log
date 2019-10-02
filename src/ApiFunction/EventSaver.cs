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
        public async static Task NewLog(Log log, ILogger<ToUpperStringRequestResponseHandler> _logger)
        {
            var client = new AmazonDynamoDBClient();

            var eventItem = new Dictionary<string, AttributeValue>
            {
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

    class Log
    {
        public string Type { get; set; }
        public DateTime When { get; set; }
        public IEnumerable<string> Tags { get; set; }
        public string Note { get; set; }
        public IDictionary<string, int> Stats { get; set; }
    }
}
