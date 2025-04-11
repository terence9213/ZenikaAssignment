using System.ComponentModel.DataAnnotations.Schema;

namespace CafeApp.Models
{
    public class EmployeeWithNumDaysWorked
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string EMailAddress { get; set; }

        public string PhoneNumber { get; set; }

        public string Gender { get; set; }

        public int NumDaysWorked { get; set; }

        public string? Cafe { get; set; } 
    }
}

