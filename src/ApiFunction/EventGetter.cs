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
    class EventGetter
    {
        public static async Task<IEnumerable<Event>> GetEvents(ILogger<ToUpperStringRequestResponseHandler> _logger)
        {
            var client = new AmazonDynamoDBClient();

            var scanResponse = await client.ScanAsync(new ScanRequest
            {
                TableName = "kl-events"
            });

            return scanResponse.Items
                .Select(x => {
                    try
                    {
                        var modelVersion = x.ContainsKey("model_version") ? x["model_version"].N : "0";
                        var @event = new Event
                        {
                            EventType = x["event"].S,
                            ModelVersion = int.Parse(modelVersion),
                            When = DateTime.Parse(x["when"].S),
                            Body = x["body"].S
                        };
                        return @event;
                    } catch(Exception ex)
                    {
                        _logger.LogInformation("Error getting event - " + JsonConvert.SerializeObject(x) + " - " + ex.Message);
                        return new Event();
                    }
                });
        }
    }
}
