using System;
using System.Threading.Tasks;
using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;
using Kralizek.Lambda;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System.Collections.Generic;
using System.Linq;

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
            object body = null;

            if(input.HttpMethod == "GET")
            {
                var events = await EventGetter.GetEvents();

                var logAutoCompletes = EventFolder.FoldLogEvents(events, _logger);

                body = logAutoCompletes.ToDictionary(x => x.Type, x => x);
            }

            if(input.HttpMethod == "POST")
            {
                var @event = JsonConvert.DeserializeObject<Log>(input.Body);

                await EventSaver.NewLog(@event, _logger);
            }

            return new APIGatewayProxyResponse
            {
                StatusCode = 200,
                Body = JsonConvert.SerializeObject(body),
                Headers = new Dictionary<string, string>
                {
                    ["Access-Control-Allow-Headers"] = "*",
                    ["Access-Control-Allow-Origin"] = "*"
                }
            };
        }
    }
}