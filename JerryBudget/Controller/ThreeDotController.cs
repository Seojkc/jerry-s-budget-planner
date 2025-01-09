using JerryBudget.Models;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory;
using static Microsoft.EntityFrameworkCore.DbLoggerCategory.Database;

namespace JerryBudget.Controller
{
    
    [Route("api/[controller]")]
    [ApiController]
    public class ThreeDotController : ControllerBase
    {

        private readonly AppDbContext _context;

        public ThreeDotController(AppDbContext context)
        {
            _context = context;
        }

        [HttpGet]
        public async Task<ActionResult<ThreeDot>> GetThreeDot()
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
            return threeDot;

        }

        [HttpGet("{year}")]
        public async Task<ActionResult<ThreeDot>> GetThisYearDetail(int year)
        {
            var query = $"select * from tblbudgetdetails where YrUserDetail={year}";

            var threeDot = await _context.BudgetDetails.FromSqlRaw(query).FirstOrDefaultAsync();
            if (threeDot == null)
            {
                query = "select * from tblbudgetdetails where YrUserDetail=Year(CURRENT_DATE)";
                threeDot = await _context.BudgetDetails.FromSqlRaw(query).FirstOrDefaultAsync();
                if (threeDot == null)
                {
                    return NotFound();
                }
                return threeDot;
            }
            return threeDot;
        }

        [HttpPost]
        public async Task<ActionResult<String>> PostThreeDot(ThreeDot threeDot)
        {
            var checkExist = $"select * from tblbudgetdetails where YrUserDetail={threeDot.YrUserDetail}";

            int count = await _context.BudgetDetails
            .FromSqlRaw(checkExist)
            .Select(x => 1) 
            .CountAsync();

            bool exists = count > 0;

            var query = "";
            if (exists)
            {
                query = $"update tblbudgetdetails set totIncome={threeDot.totIncome},monthlyTarExpense={threeDot.monthlyTarExpense},tarExpense={threeDot.monthlyTarExpense * 12} where YrUserDetail={threeDot.YrUserDetail}";

            }
            else
            {
                query = $"INSERT INTO tblbudgetdetails (totIncome,totExpense,monthlyTarExpense,currentMonthlyExpense,YrUserDetail) VALUES  ({threeDot.totIncome},0,{threeDot.monthlyTarExpense},0,{threeDot.YrUserDetail})";
                
            }
            int rowsAffected = await _context.Database.ExecuteSqlRawAsync(query);
            if (rowsAffected > 0)
            {
                Console.WriteLine("Row inserted successfully.");
            }
            else
            {
                Console.WriteLine("Insert failed.");
            }

           
            return threeDot.ToString();
        }




    }
}
