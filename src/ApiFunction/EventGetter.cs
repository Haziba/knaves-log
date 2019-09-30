using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace ApiFunction
{
    class EventGetter
    {
        public static async Task<IEnumerable<Event>> GetEvents()
        {
            var client = new AmazonDynamoDBClient();

            var scanResponse = await client.ScanAsync(new ScanRequest
            {
                TableName = "kl-events"
            });

            return scanResponse.Items
                .Select(x => JsonConvert.DeserializeObject<Event>(x["body"].S));
        }
    }
}
