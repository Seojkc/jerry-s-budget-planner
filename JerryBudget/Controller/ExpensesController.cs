using Microsoft.AspNetCore.Mvc;
using System.Collections.Generic;
using System.Threading.Tasks;
using Microsoft.EntityFrameworkCore;
using JerryBudget.Models;

[Route("api/[controller]")]
[ApiController]
public class ExpensesController : ControllerBase
{
    private readonly AppDbContext _context;

    public ExpensesController(AppDbContext context) 
    {
        _context = context;
    }

    // GET: api/Expenses
    [HttpGet]
    public async Task<ActionResult<IEnumerable<Expense>>> GetExpenses()
    {
        return await _context.Expense
                                    .OrderBy(e => e.ExpenseDate)
                                    .ToListAsync();
    }

    // GET: api/Expenses/5
    [HttpGet("{id}")]
    public async Task<ActionResult<Expense>> GetExpense(int id)
    {
        var expense = await _context.Expense.FindAsync(id);
        if (expense == null)
        {
            return NotFound();
        }
        return expense;
    }

    // POST: api/Expenses
    [HttpPost]
    public async Task<ActionResult<Expense>> PostExpense(Expense expense)
    {
        _context.Expense.Add(expense);
        await _context.SaveChangesAsync();
        return CreatedAtAction("GetExpense", new { id = expense.ExpenseID }, expense);
    }

    // PUT: api/Expenses/5
    [HttpPut("{id}")]
    public async Task<IActionResult> PutExpense(int id, Expense expense)
    {
        if (id != expense.ExpenseID)
        {
            return BadRequest();
        }

        _context.Entry(expense).State = EntityState.Modified;
        await _context.SaveChangesAsync();
        return NoContent();
    }

    // DELETE: api/Expenses/5
    [HttpDelete("{id}")]
    public async Task<IActionResult> DeleteExpense(int id)
    {
        var expense = await _context.Expense.FindAsync(id);
        if (expense == null)
        {
            return NotFound();
        }

        _context.Expense.Remove(expense);
        await _context.SaveChangesAsync();
        return NoContent();
    }
}