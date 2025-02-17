using System.ComponentModel.DataAnnotations.Schema;
using System.ComponentModel.DataAnnotations;

namespace JerryBudget.Models
{
    public class BillHistory
    {
        [Key]
        public int HistoryId { get; set; }  // Primary Key

        [Required]
        public int BillId { get; set; } // Foreign Key from tblrecurringbills

        [Required]
        public int UserId { get; set; }

        [Required]
        [StringLength(255)]
        public string BillName { get; set; }

        [Required]
        [Column(TypeName = "decimal(10,2)")]
        public decimal Amount { get; set; }

        [StringLength(255)]
        public string Category { get; set; }

        [Required]
        [DataType(DataType.Date)]
        public DateTime PaymentDate { get; set; }

        [StringLength(255)]
        public string Vendor { get; set; }

        [StringLength(100)]
        public string ReferenceNumber { get; set; }

        [Required]
        public DateTime CreatedAt { get; set; } = DateTime.UtcNow;

        
    }
}
