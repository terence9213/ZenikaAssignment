using CafeApp.Models;
using Microsoft.EntityFrameworkCore;

namespace CafeApp.Data
{
    public class AppDbContext : DbContext
    {

        public AppDbContext(DbContextOptions<AppDbContext> options) : base(options)
        {

        }

        public DbSet<Cafe> Cafes { get; set; }

        public DbSet<Employee> Employees { get; set; }

        public DbSet<Employment> Employments { get; set; } 
    }
}
