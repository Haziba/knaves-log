using System;
using System.Threading.Tasks;
using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;
using Kralizek.Lambda;
using Microsoft.Extensions.Logging;
using Badger.Data;
using Amazon.DynamoDBv2;
using Newtonsoft.Json;
using Amazon.DynamoDBv2.Model;
using System.Collections.Generic;

namespace ApiFunction
{
    public class ToUpperStringRequestResponseHandler : IRequestResponseHandler<APIGatewayProxyRequest, APIGatewayProxyResponse>
    {
        private readonly ILogger<ToUpperStringRequestResponseHandler> _logger;

        public ToUpperStringRequestResponseHandler(ILogger<ToUpperStringRequestResponseHandler> logger)
        {
            if (logger == null)
            {
                throw new ArgumentNullException(nameof(logger));
            }
            _logger = logger;
        }

        public async Task<APIGatewayProxyResponse> HandleAsync(APIGatewayProxyRequest input, ILambdaContext context)
        {
            var client = new AmazonDynamoDBClient();

            await EventSaver.SaveEvent(new Event
            {
                Type = "test",
                Note = "Cool note",
                Stats = new Dictionary<string, int>
                {
                    ["Cool"] = 5,
                    ["Stuff"] = 15
                },
                Tags = new[] { "TV time", "Not game time" },
                When = DateTime.UtcNow
            });

            return new APIGatewayProxyResponse
            {
                StatusCode = 200
            };
        }

        public class GetOne : IQuery<int>
        {
            public IPreparedQuery<int> Prepare(IQueryBuilder queryBuilder)
            {
                return queryBuilder.WithSql("select 5").WithScalar<int>().Build();
            }
        }
    }
}