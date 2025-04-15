using System.ComponentModel.DataAnnotations.Schema;

namespace CafeApp.Models
{
    public class EmploymentWithCafeNameDTO
    {
        public string EmployeeId { get; set; }

        public DateTime StartDate { get; set; }

        public DateTime? EndDate { get; set; }

        public string CafeId { get; set; }

        public string CafeName { get; set; }
    }
}
