using System.ComponentModel.DataAnnotations.Schema;

namespace CafeApp.Models
{
    public class EmployeeWithCafeIdDTO
    {
        public string Id { get; set; }

        public string Name { get; set; }

        public string EMailAddress { get; set; }

        public string PhoneNumber { get; set; }

        public string Gender { get; set; }

        public string CafeId { get; set; }

    }
}
