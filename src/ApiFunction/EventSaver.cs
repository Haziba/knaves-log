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
        public async static Task SaveEvent(Event @event, ILogger<ToUpperStringRequestResponseHandler> _logger)
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
                    S = "CREATE_LOG",
                },
                ["body"] = new AttributeValue
                {
                    S = JsonConvert.SerializeObject(@event)
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

    class Event
    {
        public string Type { get; set; }
        public DateTime When { get; set; }
        public IEnumerable<string> Tags { get; set; }
        public string Note { get; set; }
        public IDictionary<string, int> Stats { get; set; }
    }
}
