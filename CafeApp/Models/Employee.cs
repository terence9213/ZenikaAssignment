using System.ComponentModel.DataAnnotations.Schema;

namespace CafeApp.Models
{
    public class Employee
    {
        [Column("ID")]
        public string Id { get; set; }

        [Column("NAME")]
        public string Name { get; set; }

        [Column("EMAIL")]
        public string EMailAddress { get; set; }

        [Column("PHONE")]
        public string PhoneNumber { get; set; }

        [Column("GENDER")]
        public string Gender { get; set; }
    }
}
