using JerryBudget.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Any;
using MySqlConnector;
using System;
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
        public async Task<ActionResult<IEnumerable<RecurringBill>>> GetRecurringBills()
        {
            try
            {
                var sqlQuery = @"
                             SELECT 
                                bill_id, 
                                user_id, 
                                IFNULL(bill_name, '') AS bill_name, 
                                IFNULL(amount, 0.00) AS amount, 
                                frequency, 
                                start_date, 
                                IFNULL(end_date, '1990-01-01') AS end_date, 
                                IFNULL(category, 'Food') AS category, 
                                IFNULL(description, '') AS description, 
                                IFNULL(send_notification, 0) AS send_notification, 
                                IFNULL(notification_days_before, 0) AS notification_days_before, 
                                IFNULL(payment_method, '') AS payment_method, 
                                IFNULL(vendor, '') AS vendor, 
                                IFNULL(reference_number, '') AS reference_number, 
                                IFNULL(blnStatus, 1) AS blnStatus, 
                                next_due_date 
                            FROM tblrecurringbills 
                            WHERE blnStatus = 1 
                            ORDER BY bill_id ASC;
                    ";

                var recurringBills = await _context.Set<RecurringBill>()
                    .FromSqlRaw(sqlQuery)
                    .ToListAsync();

                if (!recurringBills.Any())
                {
                    return NotFound("No recurring bills found");
                }

                return Ok(recurringBills);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
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

        [HttpGet("upcomingBills")]
        public async Task<ActionResult<IEnumerable<RecurringBill>>> upcomingBills()
        {
            try
            {
                var sqlQuery = @"
                             SELECT 
                                bill_id, 
                                user_id, 
                                IFNULL(bill_name, '') AS bill_name, 
                                IFNULL(amount, 0.00) AS amount, 
                                frequency, 
                                start_date, 
                                IFNULL(end_date, '1990-01-01') AS end_date, 
                                IFNULL(category, 'Food') AS category, 
                                IFNULL(description, '') AS description, 
                                IFNULL(send_notification, 0) AS send_notification, 
                                IFNULL(notification_days_before, 0) AS notification_days_before, 
                                IFNULL(payment_method, '') AS payment_method, 
                                IFNULL(vendor, '') AS vendor, 
                                IFNULL(reference_number, '') AS reference_number, 
                                IFNULL(blnStatus, 1) AS blnStatus, 
                                next_due_date 
                            FROM tblrecurringbills 
                            WHERE blnStatus = 1 
                            AND next_due_date >= LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY - INTERVAL 1 MONTH  
                            AND next_due_date < LAST_DAY(CURRENT_DATE) + INTERVAL 1 DAY 
                            ORDER BY bill_id ASC;
                    ";

                var recurringBills = await _context.Set<RecurringBill>()
                    .FromSqlRaw(sqlQuery)
                    .ToListAsync();

                if (!recurringBills.Any())
                {
                    return NotFound("No recurring bills found");
                }

                return Ok(recurringBills);
            }
            catch (Exception ex)
            {
                return StatusCode(500, ex.Message);
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
        

        [HttpPut("{id}/skipPaymentFn")]
        public async Task<IActionResult> skipPaymentFn(int id)
        {
            try
            {
                // Validate the ID
                if (id <= 0)
                {
                    return BadRequest("Invalid bill ID");
                }



                // Execute the update
                int rowsAffected = await _context.Database.ExecuteSqlRawAsync("CALL prcskipThePayment(@id)", new MySqlParameter("@id", id));

                if (rowsAffected > 0)
                {
                    return Ok(new
                    {
                        message = $"Bill with ID {id} skipped successfully.",
                        bill_id = id
                    });
                }
                else
                {
                    return NotFound($"Bill with ID {id} not found or already skipped.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpPut("{id}/markaspaid")]
        public async Task<IActionResult> MarkBillAsPaid(int id)
        {
            try
            {
                // Validate the ID
                if (id <= 0)
                {
                    return BadRequest("Invalid bill ID");
                }



                // Execute the update
                int rowsAffected = await _context.Database.ExecuteSqlRawAsync("CALL prcMarkASPaidtoExpenseTable(@id)", new MySqlParameter("@id", id));

                if (rowsAffected > 0)
                {
                    return Ok(new
                    {
                        message = $"Bill with ID {id} marked as paid successfully.",
                        bill_id = id
                    });
                }
                else
                {
                    return NotFound($"Bill with ID {id} not found or already marked as paid.");
                }
            }
            catch (Exception ex)
            {
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
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


        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteBill(int id)
        {
            try
            {
                int rowsAffected = await _context.Database.ExecuteSqlRawAsync($"update tblrecurringbills set blnStatus=0 WHERE bill_id = {id}");

                if (rowsAffected == 0)
                {
                    return NotFound(new { message = "Bill not found" });
                }

                return Ok(new { message = "Bill deleted successfully" });
            }
            catch (Exception ex)
            {
                Console.Error.WriteLine($"Error in DeleteBill: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }


        [HttpPost("composeMail")]
        public async Task<IActionResult> ComposeMail([FromBody] MailDetail mailDetail)
        {
            // Calculate next due date
            try
            {

                var query = $"INSERT INTO email_queue ( recipient, subject, body,send_at) VALUES " +
                            $"('{mailDetail.recipient}', " + 
                            $"'{mailDetail.subject}', " +
                            $"'{mailDetail.body}', " +
                            $"'{mailDetail.created_at}'" +
                            $");";

                int rowsAffected = await _context.Database.ExecuteSqlRawAsync(query);
                if (rowsAffected > 0)
                {
                    return Ok("Bill created successfully.");
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


        [HttpGet("getBillHistory")]
        public async Task<IActionResult> GetAllBillHistory()
        {
            string sqlQuery = "SELECT history_id AS HistoryId,  " +
                "bill_id AS BillId,    " +
                "user_id AS UserId,   " +
                "bill_name AS BillName,  " +
                "amount AS Amount,   " +
                "category AS Category,    " +
                "payment_date AS PaymentDate, " +
                "vendor AS Vendor,  " +
                "reference_number AS ReferenceNumber,      " +
                "created_at AS  CreatedAt       " +
                "FROM tblbill_history";
            var billHistories = await _context.BillHistory
                                              .FromSqlRaw(sqlQuery)
                                              .ToListAsync();

            return Ok(billHistories);
        }











    }
}
