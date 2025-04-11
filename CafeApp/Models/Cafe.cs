using System.ComponentModel.DataAnnotations.Schema;

namespace CafeApp.Models
{
    public class Cafe
    {
        // UIXXXXXXX
        // UI0000001
        [Column("ID")]
        public string Id { get; set; }

        [Column("NAME")]
        public string Name { get; set; }

        [Column("DESCRIPTION")]
        public string Description { get; set; }

        [Column("LOCATION")]
        public string Location { get; set; }
    }
}
