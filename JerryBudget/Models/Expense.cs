namespace JerryBudget.Models
{
    public class Expense
    {
        public int ExpenseID { get; set; }
        public int UserID { get; set; }
        public string Category { get; set; }
        public string Description { get; set; }
        public decimal Amount { get; set; }
        public DateTime ExpenseDate { get; set; }
        public int BudgetID { get; set; }
    }
}
