using System.ComponentModel.DataAnnotations.Schema;

namespace AllianzCPA
{
    public class MailData
    {
        public string To { get; set; }
        public string Attachment { get; set; }
        public string type { get; set; }
        public string product { get; set; }
    }

    public class UploadedFiles
    {
        [DatabaseGenerated(DatabaseGeneratedOption.Identity)]
        public int Id { get; set; }
        public string filename { get; set; }
        public string filepath { get; set; }
        public string type { get; set; }
        public string category { get; set; }
        public string ownerId { get; set; }
        public string owner { get; set; }
    }
}