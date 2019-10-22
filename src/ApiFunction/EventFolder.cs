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
        IDictionary<int, Type> LogVersions = new Dictionary<int, Type>
        {
            [0] = typeof(Log_V0),
            [1] = typeof(Log_V1)
        };

        public static IEnumerable<LogAutoComplete> AutoComplete(IEnumerable<Event> events, ILogger<ToUpperStringRequestResponseHandler> _logger)
        {
            var logs = new List<LogAutoComplete>();

            var orderedEvents = events.OrderBy(e => e.When);

            foreach(var @event in orderedEvents){
                var log = LogFromBody(@event.ModelVersion, @event.Body);
                
                switch (@event.EventType)
                {
                    case "LOG_CREATED":
                        if (!logs.Any(x => x.Type == log.Type))
                        {
                            logs.Add(new LogAutoComplete
                            {
                                Type = log.Type,
                                StatsAndUnits = new LogAutoComplete.StatAndUnits[0],
                                Tags = new List<string>()
                            });
                        }

                        var logAutoComplete = logs.First(x => x.Type == log.Type);

                        var stats = new Dictionary<string, IList<string>>();

                        if (log.Stats != null)
                        {
                            foreach (var stat in log.Stats)
                            {
                                if (!stats.ContainsKey(stat.Name))
                                    stats.Add(stat.Name, new List<string>());
                                if (!string.IsNullOrEmpty(stat.Units) && !stats[stat.Name].Contains(stat.Units))
                                    stats[stat.Name].Add(stat.Units);
                            }
                            logAutoComplete.StatsAndUnits = stats.Select(x => new LogAutoComplete.StatAndUnits { Stat = x.Key, Units = x.Value }).ToArray();
                        }
                        if(log.Tags != null)
                            logAutoComplete.Tags = logAutoComplete.Tags.Union(log.Tags).Distinct();

                        break;
                }
            }

            return logs;
        }

        public static Log_V1 LogFromBody(int modelVersion, string body)
        {
            if (modelVersion == 1)
                return JsonConvert.DeserializeObject<Log_V1>(body);

            object log;
            log = JsonConvert.DeserializeObject<Log_V0>(body);

            do
            {
                log = ((IUpgradeable)log).Upgrade();
            }
            while (log is IUpgradeable);

            return (Log_V1)log;
        }
    }

    public class LogAutoComplete
    {
        public string Type { get; set; }
        public IEnumerable<StatAndUnits> StatsAndUnits { get; set; }
        public IEnumerable<string> Tags { get; set; }

        public class StatAndUnits
        {
            public string Stat { get; set; }
            public IEnumerable<string> Units { get; set; }
        }
    }
}
