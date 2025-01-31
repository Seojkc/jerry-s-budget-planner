using JerryBudget.Models;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.SqlClient;
using Microsoft.EntityFrameworkCore;
using Microsoft.OpenApi.Any;
using MySqlConnector;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace JerryBudget.Controller
{
    [Route("api/[controller]")]
    [ApiController]
    public class ExpenseDataResponseController : ControllerBase
    {
        private readonly AppDbContext _context;

        public ExpenseDataResponseController(AppDbContext context)
        {
            _context = context;
        }
        //GetTargetExpenseAmount

        [HttpGet("GetTargetExpenseAmount")]
        public async Task<ActionResult<AnyType>> GetTargetExpenseAmount()
        {
            try
            {

                var currentYear = DateTime.Now.Year;
                var query = "select * from tblbudgetdetails where YrUserDetail=Year(CURRENT_DATE)";

                var threeDot = await _context.BudgetDetails.FromSqlRaw(query).FirstOrDefaultAsync();

                if (threeDot == null)
                {
                    query = $"INSERT INTO tblbudgetdetails (totIncome,totExpense,monthlyTarExpense,currentMonthlyExpense,YrUserDetail) VALUES  (0,0,0,0,Year(CURRENT_DATE))";
                    int rowsAffected = await _context.Database.ExecuteSqlRawAsync(query);
                    query = "select * from tblbudgetdetails where YrUserDetail=Year(CURRENT_DATE)";
                    threeDot = await _context.BudgetDetails.FromSqlRaw(query).FirstOrDefaultAsync();

                }

                decimal targetAmount = threeDot.monthlyTarExpense;

                return Ok(targetAmount);
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.Error.WriteLine($"Error in GetTargetExpenseData: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }



        [HttpGet("GetTargetExpenseData/{range}")]
        public async Task<ActionResult<AnyType>> GetTargetExpenseData(string range)
        {
            try
            {

               // var response = new ExpenseDataResponse();

                // Validate the range parameter
                var validRanges = new[] { "3months", "6months", "1year", "5years", "all" };
                if (!validRanges.Contains(range.ToLower()))
                {
                    return BadRequest("Invalid range specified. Valid values are: 3months, 6months, 1year, 5years, all.");
                }

                // Call the stored procedure
                var expenseData = await _context.Set<ExpenseData>()
                    .FromSqlRaw("CALL GetTargetExpenseData(@Range)", new MySqlParameter("@Range", range))
                    .ToListAsync();


                
                var response = new ExpenseDataResponse
                {
                    Labels = expenseData.Select(sd => sd.Label).ToList(),
                    Data = expenseData.Select(sd => sd.Price).ToList()
                };

                return Ok(response);
            }
            catch (Exception ex)
            {
                // Log the exception
                Console.Error.WriteLine($"Error in GetTargetExpenseData: {ex.Message}");
                return StatusCode(500, $"Internal server error: {ex.Message}");
            }
        }
    }
}