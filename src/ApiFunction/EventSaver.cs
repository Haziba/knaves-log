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
        public async static Task SaveEvent(Event @event, Microsoft.Extensions.Logging.ILogger<ToUpperStringRequestResponseHandler> _logger)
        {
            var client = new AmazonDynamoDBClient();

            var eventItem = new Dictionary<string, AttributeValue>
            {
                ["event-type"] = new AttributeValue
                {
                    S = @event.Type,
                },
                ["when"] = new AttributeValue
                {
                    S = @event.When.ToString("o")
                },
                ["note"] = new AttributeValue
                {
                    S = @event.Note
                }
            };

            if (@event.Tags.Count() > 0)
                eventItem["tags"] = new AttributeValue
                {
                    SS = @event.Tags.ToList()
                };

            if (@event.Stats.Count() > 0)
                eventItem["stats"] = new AttributeValue
                {
                    M = @event.Stats.ToDictionary(x => x.Key, x => new AttributeValue
                    {
                        N = x.Value.ToString()
                    })
                };

            _logger.LogInformation("Event item! - " + JsonConvert.SerializeObject(eventItem));

            await client.PutItemAsync(new PutItemRequest
            {
                TableName = "kl-log-events",
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
