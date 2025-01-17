﻿using JerryBudget.Models;
using Microsoft.EntityFrameworkCore;

public class AppDbContext : DbContext
{
    public AppDbContext(DbContextOptions<AppDbContext> options) : base(options) 
    {

    }

    public DbSet<Expense> Expense { get; set; }

    public DbSet<ThreeDot> BudgetDetails { get; set; }

    protected override void OnModelCreating(ModelBuilder modelBuilder)
    {
        base.OnModelCreating(modelBuilder);

        // Map the ThreeDot model to tblbudgetdetails explicitly
        modelBuilder.Entity<ThreeDot>().ToTable("tblbudgetdetails");
    }

}