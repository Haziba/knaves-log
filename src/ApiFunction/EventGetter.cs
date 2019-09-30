﻿using Amazon.DynamoDBv2;
using Amazon.DynamoDBv2.Model;
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
                TableName = "kl-log-events"
            });

            return scanResponse.Items.Select(x => new Event
            {
                Type = x["event-type"].S,
                Note = x["note"].S,
                When = DateTime.Parse(x["when"].S),
            });
        }
    }
}