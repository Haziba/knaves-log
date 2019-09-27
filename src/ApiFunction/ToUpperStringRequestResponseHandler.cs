using System;
using System.Threading.Tasks;
using Amazon.Lambda.Core;
using Amazon.Lambda.APIGatewayEvents;
using Kralizek.Lambda;
using Microsoft.Extensions.Logging;
using Newtonsoft.Json;

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
            var @event = JsonConvert.DeserializeObject<Event>(input.Body);

            @event.When = DateTime.UtcNow;

            await EventSaver.SaveEvent(@event);

            return new APIGatewayProxyResponse
            {
                StatusCode = 200
            };
        }
    }
}