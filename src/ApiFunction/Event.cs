using System;

namespace ApiFunction
{
    class Event
    {
        public string EventType { get; set; }
        public int ModelVersion { get; set; }
        public DateTime When { get; set; }
        public string Body { get; set; }
    }
}
