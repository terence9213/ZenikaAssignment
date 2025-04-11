using System.ComponentModel.DataAnnotations.Schema;
using Microsoft.EntityFrameworkCore;

namespace CafeApp.Models
{
    [PrimaryKey(nameof(EmployeeId), nameof(StartDate))]
    public class Employment
    {
        [Column("EMPLOYEE_ID")]
        public string EmployeeId { get; set; }

        [Column("START_DATE")]
        public DateTime StartDate { get; set; }

        [Column("END_DATE")]
        public DateTime? EndDate { get; set; }

        [Column("CAFE_ID")]
        public string CafeId { get; set; }
    }
}
