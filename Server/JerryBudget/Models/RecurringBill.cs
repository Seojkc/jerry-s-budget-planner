using System.ComponentModel.DataAnnotations;

namespace JerryBudget.Models
{
    public class RecurringBill
    {
        public int bill_id { get; set; }
        public int? user_id { get; set; }
        public string? bill_name { get; set; }
        [Range(0.01, double.MaxValue)] public decimal amount { get; set; }
        [Required] public string frequency { get; set; }
        public DateTime start_date { get; set; }
        public DateTime? end_date { get; set; }
        public string category { get; set; }
        public string description { get; set; }
        public bool send_notification { get; set; }
        [Range(0, 30)] public int? notification_days_before { get; set; }
        public string payment_method { get; set; }
        public string vendor { get; set; }
        public string reference_number { get; set; }
        public bool blnStatus { get; set; }
        public DateTime next_due_date { get; set; }
    }
}
