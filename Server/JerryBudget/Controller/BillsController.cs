using JerryBudget.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Any;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;

namespace JerryBudget.Controller
{

    [Route("api/[controller]")]
    [ApiController]
    public class BillsController : ControllerBase
    {

        private readonly AppDbContext _context;

        public BillsController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet()]
        public async Task<ActionResult<RecurringBill>> GetBill()
        {
            try
            {
                var recurringBill = await _context.Set<RecurringBill>().FromSqlRaw($" SELECT bill_id, user_id, bill_name, amount  ,frequency, start_date, end_date, category, description, send_notification, notification_days_before, payment_method, vendor, reference_number, blnStatus, next_due_date FROM tblrecurringbills ORDER BY tblrecurringbills.bill_id ASC").ToListAsync();

                if (recurringBill == null)
                {
                    return NotFound();
                }
                return Ok(recurringBill);
            }

            catch (Exception ex)
            {
                // Log the exception
                Console.Error.WriteLine($"Error in GetTargetExpenseData: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        [HttpGet("{id}")]
        public async Task<ActionResult<RecurringBill>> GetBill(int id)
        {
            try
            {
                var recurringBill = await _context.Set<RecurringBill>().FromSqlRaw($" SELECT bill_id, user_id, bill_name, amount  ,frequency, start_date, end_date, category, description, send_notification, notification_days_before, payment_method, vendor, reference_number, blnStatus, next_due_date FROM tblrecurringbills where bill_id={id} ORDER BY tblrecurringbills.bill_id ASC").ToListAsync();

                if (recurringBill == null)
                {
                    return NotFound();
                }
                return Ok(recurringBill);
            }

            catch (Exception ex)
            {
                // Log the exception
                Console.Error.WriteLine($"Error in GetTargetExpenseData: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }

        private DateTime CalculateNextDueDate(DateTime startDate, string frequency)
        {
            return frequency switch
            {
                "Monthly" => startDate.AddMonths(1),
                "Bi-Weekly" => startDate.AddDays(14),
                "Annual" => startDate.AddYears(1),
                _ => startDate
            };
        }




        [HttpPost]
        public async Task<IActionResult> CreateBill([FromBody] RecurringBill bill)
        {
            // Calculate next due date
            try
            {
                bill.next_due_date = CalculateNextDueDate(bill.start_date, bill.frequency);

                var query = $"INSERT INTO tblrecurringbills (user_id, bill_name, amount, frequency, start_date, end_date, category, description, send_notification, notification_days_before, payment_method, vendor, reference_number, blnStatus, next_due_date) VALUES " +
                            $"({bill.user_id}, " +
                            $"'{bill.bill_name}', " +
                            $"{bill.amount}, " +
                            $"'{bill.frequency}', " +
                            $"'{bill.start_date:yyyy-MM-dd}', " +   // Format Date properly
                            $"{(bill.end_date.HasValue ? $"'{bill.end_date.Value:yyyy-MM-dd}'" : "NULL")}, " +  // Handle NULL values
                            $"'{bill.category}', " +
                            $"'{bill.description}', " +
                            $"{(bill.send_notification ? 1 : 0)}, " +  // Convert Boolean to 1/0
                            $"{(bill.notification_days_before.HasValue ? bill.notification_days_before.Value.ToString() : "NULL")}, " +
                            $"{(string.IsNullOrEmpty(bill.payment_method) ? "NULL" : $"'{bill.payment_method}'")}, " +  // Handle NULL for strings
                            $"{(string.IsNullOrEmpty(bill.vendor) ? "NULL" : $"'{bill.vendor}'")}, " +
                            $"{(string.IsNullOrEmpty(bill.reference_number) ? "NULL" : $"'{bill.reference_number}'")}, " +
                            $"{(bill.blnStatus ? 1 : 0)}, " +
                            $"'{bill.next_due_date:yyyy-MM-dd}'" +  // Format Date properly
                            $");";

                int rowsAffected = await _context.Database.ExecuteSqlRawAsync(query);
                if (rowsAffected > 0)
                {
                    return CreatedAtAction(nameof(GetBill), new { id = bill.bill_id }, new
                    {
                        message = "Bill created successfully.",
                        bill = bill
                    });
                }
                else
                {
                    return BadRequest("Failed to insert bill.");
                }
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error in CreateBill: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }









    }
}
