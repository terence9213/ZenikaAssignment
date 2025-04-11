using System.ComponentModel.DataAnnotations.Schema;

namespace CafeApp.Models
{
    public class CafeWithNumEmployeesDTO
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string Description { get; set; }

        public string Location { get; set; }

        public int NumEmployees { get; set; }
    }
}
