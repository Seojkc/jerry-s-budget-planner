namespace JerryBudget.Models
{
    public class MailDetail
    {
        int id { get; set; }
        public string recipient { get; set; }
        public string subject { get; set; }
        public string body { get; set; }
        public int sent_flag { get; set; }
        public DateTime created_at { get; set; } = DateTime.Now;
        public int user_id { get; set; }


    }
}

