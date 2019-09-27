using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiFunction
{
    class EventSaver
    {
        public async static Task SaveEvent(Event @event)
        {
            var client = new AmazonDynamoDBClient();

            await client.PutItemAsync(new PutItemRequest
            {
                TableName = "kl-log-events",
                Item = new Dictionary<string, AttributeValue>
                {
                    ["event-type"] = new AttributeValue
                    {
                        S = @event.Type
                    },
                    ["when"] = new AttributeValue
                    {
                        S = @event.When.ToString("o")
                    },
                    ["tags"] = new AttributeValue
                    {
                        SS = @event.Tags.ToList()
                    },
                    ["note"] = new AttributeValue
                    {
                        S = @event.Note
                    },
                    ["stats"] = new AttributeValue
                    {
                        M = @event.Stats.ToDictionary(x => x.Key, x => new AttributeValue
                        {
                            N = x.Value.ToString()
                        })
                    }
                }
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
