using System;
using System.Collections.Generic;
using System.Linq;

namespace ApiFunction
{
    public class Log_V1
    {
        public string Type { get; set; }
        public DateTime When { get; set; }
        public IEnumerable<string> Tags { get; set; }
        public string Note { get; set; }
        public IEnumerable<Stat> Stats { get; set; }

        public class Stat
        {
            public string Name { get; set; }
            public int Value { get; set; }
            public string Units { get; set; }
        }
    }

    public class Log_V0 : IUpgradeable
    {
        public string Type { get; set; }
        public DateTime When { get; set; }
        public IEnumerable<string> Tags { get; set; }
        public string Note { get; set; }
        public IDictionary<string, int> Stats { get; set; }
        
        public object Upgrade()
        {
            return new Log_V1
            {
                Type = Type,
                When = When,
                Tags = Tags,
                Note = Note,
                Stats = Stats.Keys.Select(key => new Log_V1.Stat
                {
                    Name = key,
                    Value = Stats[key],
                    Units = string.Empty
                })
            };
        }
    }
}
