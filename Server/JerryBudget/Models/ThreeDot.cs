namespace JerryBudget.Models
{
    public class ThreeDot
    {
        public int id { get; set; }
        public decimal totIncome { get; set; }
        public decimal totExpense{ get; set; }
        public decimal tarExpense{ get; set; }
        public decimal monthlyTarExpense  { get; set; }
        public decimal currentMonthlyExpense { get; set; }

        public int YrUserDetail {  get; set; }

    }
}
