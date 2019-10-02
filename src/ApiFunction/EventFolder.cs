using Microsoft.Extensions.Logging;
using Newtonsoft.Json;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;

namespace ApiFunction
{
    class EventFolder
    {
        public static IEnumerable<LogAutoComplete> FoldLogEvents(IEnumerable<Event> events, ILogger<ToUpperStringRequestResponseHandler> _logger)
        {
            var logs = new List<LogAutoComplete>();

            var orderedEvents = events.OrderBy(e => e.When);

            foreach(var @event in orderedEvents){
                var log = JsonConvert.DeserializeObject<Log>(@event.Body);

                switch (@event.EventType)
                {
                    case "LOG_CREATED":
                        if (!logs.Any(x => x.Type == log.Type))
                        {
                            logs.Add(new LogAutoComplete
                            {
                                Type = log.Type,
                                Stats = new List<string>(),
                                Tags = new List<string>()
                            });
                        }

                        var logAutoComplete = logs.First(x => x.Type == log.Type);

                        if(log.Stats != null)
                            logAutoComplete.Stats = logAutoComplete.Stats.Union(log.Stats.Keys).Distinct();
                        if(log.Tags != null)
                            logAutoComplete.Tags = logAutoComplete.Tags.Union(log.Tags).Distinct();

                        break;
                }
            }

            return logs;
        }
    }

    public class LogAutoComplete
    {
        public string Type { get; set; }
        public IEnumerable<string> Stats { get; set; }
        public IEnumerable<string> Tags { get; set; }
    }
}
