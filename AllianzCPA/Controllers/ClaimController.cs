using Microsoft.AspNetCore.Hosting;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Extensions.Hosting;
using System;
using System.Collections.Generic;
using System.IO;
using System.Linq;
using System.Net.Mail;
using System.Threading.Tasks;

namespace AllianzCPA.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ClaimController : ControllerBase
    {
        private readonly IWebHostEnvironment _webHostEnvironment;

        public ClaimController(IWebHostEnvironment webHostEnvironment)
        {
            _webHostEnvironment = webHostEnvironment;
        }

        [Route("Claims")]
        [HttpPost]
        public IActionResult PostClaims(MailData data)
        {
            var pdfBinary = Convert.FromBase64String(data.Attachment);
            string webRootPath = _webHostEnvironment.WebRootPath;
            string dir = _webHostEnvironment.ContentRootPath + "\\ClaimsDatatDump";
            //var dir = HttpContext.Current.Server.MapPath("~/DataDump");

            if (!Directory.Exists(dir))
                Directory.CreateDirectory(dir);

            var fileName = dir + "\\" + data.product + " - " + "Claim Form-" + DateTime.Now.ToString("yyyyMMdd-HHMMss") + ".pdf";

            // write content to the pdf
            using (var fs = new FileStream(fileName, FileMode.Create))
            using (var writer = new BinaryWriter(fs))
            {
                writer.Write(pdfBinary, 0, pdfBinary.Length);
                writer.Close();
            }

            //Send mail
            string subject = "Allianz Claims Form";
            //string testt = "";
            string testt = "This is a test sample. Please kindly Ignore \\n";
            string body = testt + "Kindly find attached a copy of your Claims Online Form";
            var receipient = Receipient.Get(data.type, data.product);
            var status = SendMail(fileName, data.To, subject, body, receipient);

            //Delete file from file system
            //System.IO.File.Delete(fileName);

            //Return result to client
            return Ok(status ? new { result = "success" } : new { result = "failed" });
        }

        [HttpPost]
        [Route("uploading")]
        public async Task<IActionResult> UploadFiled(IFormFile file, string product, string type, string policyno)
        {
            //foreach (var file in files)
            //{
               try
               {
                   Console.WriteLine(Directory.GetCurrentDirectory());
                   if (file == null || file.Length == 0)
                        return Content("file not selected");
                    Guid _newFileName = Guid.NewGuid();
                    // Get the complete file path
                    string newFileName = _newFileName.ToString() + Path.GetExtension(file.FileName);
                    string path = "";
                    //if (_hostingEnv.IsProduction())
                    if (_webHostEnvironment.IsProduction())
                    {

                    
                    path = Path.Combine(
                            Directory.GetCurrentDirectory(), "ClaimsDatatDump", "Attachments", newFileName);
                    }
                    else
                    {
                        path = Path.Combine(
                            Directory.GetCurrentDirectory(), "ClaimsDatatDump", "Attachments", newFileName);
                    }
                var dir = Path.Combine(Directory.GetCurrentDirectory(), "ClaimsDatatDump", "Attachments");
                if (!Directory.Exists(dir))
                    Directory.CreateDirectory(dir);
                using (var stream = new FileStream(path, FileMode.Create))
                {
                    await file.CopyToAsync(stream);
                }

                //string testt = "";
                string testt = "This is a test sample. Please kindly Ignore \\n";
                string message = testt + "<p>Attached are the Claims form submissions with the following product </p> <br />" +
                    "<b>Product:</b> " + product + "<br />" +
                    "<b>Policy No:</b> " + policyno + "<br />" +
                    "<b>Type:</b> " + type;
                var receipient = Receipient.Get(type, product);
                SendAttachment(path, receipient, "Claims Form Submission Attachments", message);
                //var files = new FileInfo() { filename = newFileName, filepath = "ClientApp\\dist\\assets\\images", fieldname = file.FileName };
                //var files = new FileInfo() { filename = file.FileName, filepath = new PathString("/Uploads"), fieldname = "" };
                //return Ok(files);
            }catch(Exception ex)
            {
                Console.WriteLine(ex);
                return BadRequest(ex.Message);
            } 
            //}


            return Ok(file);
        }


        [HttpPost]
        [Route("upload")]
        public async Task<IActionResult> UploadFile(List<IFormFile> files, string product, string type, string policyno)
        {
            var ppp = new List<string>();
            //var 
            foreach (var file in files)
            {
                try
                {
                    Console.WriteLine(Directory.GetCurrentDirectory());
                    if (file == null || file.Length == 0)
                        return Content("file not selected");
                    Guid _newFileName = Guid.NewGuid();
                    // Get the complete file path
                    string newFileName = policyno + "-" + _newFileName.ToString() + Path.GetExtension(file.FileName);
                    string path = "";
                    //if (_hostingEnv.IsProduction())
                    if (_webHostEnvironment.IsProduction())
                    {


                        path = Path.Combine(
                                Directory.GetCurrentDirectory(), "ClaimsDatatDump", "Attachments", newFileName);
                    }
                    else
                    {
                        path = Path.Combine(
                            Directory.GetCurrentDirectory(), "ClaimsDatatDump", "Attachments", newFileName);
                    }
                    var dir = Path.Combine(Directory.GetCurrentDirectory(), "ClaimsDatatDump", "Attachments");
                    if (!Directory.Exists(dir))
                        Directory.CreateDirectory(dir);
                    using (var stream = new FileStream(path, FileMode.Create))
                    {
                        await file.CopyToAsync(stream);
                    }

                    ppp.Add(path);

                    //var files = new FileInfo() { filename = newFileName, filepath = "ClientApp\\dist\\assets\\images", fieldname = file.FileName };
                    //var files = new FileInfo() { filename = file.FileName, filepath = new PathString("/Uploads"), fieldname = "" };
                    //return Ok(files);
                }
                catch (Exception ex)
                {
                    Console.WriteLine(ex);
                    return BadRequest(ex.Message);
                }
            }

            //string testt = "";
            string testt = "This is a test sample. Please kindly Ignore \\n";
            string message = testt + "<p>Attached are the Claims form submissions with the following product </p> <br />" +
                    "<b>Product:</b> " + product + "<br />" +
                    "<b>Policy No:</b> " + policyno + "<br />" +
                    "<b>Type:</b> " + type;
            var receipient = Receipient.Get(type, product);
            SendAttachments(ppp, receipient, "Claims Form Submission Attachments", message);


            return Ok(files);
        }


        private bool SendMail(string filePath, string recipient, string subject, string body, string Bcc)
        {
            //var mailConfig = _smtpConfigService.ListAllSetupSmtpConfig().Where(u => u.configname == "mailconfig").FirstOrDefault();
            using (var client = new SmtpClient()
            {
                Port = 587, //mailConfig.port, //
                Credentials = new System.Net.NetworkCredential("notification@allianz.ng", "Allianz1234"), //mailConfig.username, mailConfig.password
                                                                                                         
                DeliveryMethod = SmtpDeliveryMethod.Network,
                EnableSsl = true, //mailConfig.isSSL,// = 
                Host = "smtp.office365.com", //mailConfig.smtp //= 

            })
            using (var mail = new MailMessage())
            {
                mail.To.Add(recipient);
                mail.Subject = subject;
                mail.Body = body;
                mail.Bcc.Add(Bcc);
                mail.IsBodyHtml = true;
                var attachment = new Attachment(filePath);
                mail.Attachments.Add(attachment);
                //mail.From = new MailAddress("Anchor <" + "segxy2708@hotmail.com" + ">");
                mail.From = new MailAddress("Allianz <" + "notification@allianz.ng" + ">");
                try
                {
                    client.Send(mail);
                    return true;
                }
                catch (Exception ex)
                {
                    var p = ex.Message;
                    return false;
                }

            }

        }

        private bool SendAttachment(string filePath, string recipient, string subject, string body)
        {
            //var mailConfig = _smtpConfigService.ListAllSetupSmtpConfig().Where(u => u.configname == "mailconfig").FirstOrDefault();
            using (var client = new SmtpClient()
            {
                Port = 587, //mailConfig.port, //
                Credentials = new System.Net.NetworkCredential("notification@allianz.ng", "Allianz1234"), //mailConfig.username, mailConfig.password
                                                                                                          
                DeliveryMethod = SmtpDeliveryMethod.Network,
                EnableSsl = true, //mailConfig.isSSL,// = 
                Host = "smtp.office365.com", //mailConfig.smtp //= 

            })
            using (var mail = new MailMessage())
            {
                mail.To.Add(recipient);
                mail.Subject = subject;
                mail.Body = body;
                mail.IsBodyHtml = true;
                var attachment = new Attachment(filePath);
                mail.Attachments.Add(attachment);
                //mail.From = new MailAddress("Anchor <" + "segxy2708@hotmail.com" + ">");
                mail.From = new MailAddress("Allianz <" + "notification@allianz.ng" + ">");
                try
                {
                    client.Send(mail);
                    return true;
                }
                catch (Exception ex)
                {
                    var p = ex.Message;
                    return false;
                }

            }

        }

        private bool SendAttachments(List<string> filePath, string recipient, string subject, string body)
        {
            //var mailConfig = _smtpConfigService.ListAllSetupSmtpConfig().Where(u => u.configname == "mailconfig").FirstOrDefault();
            using (var client = new SmtpClient()
            {
                Port = 587, //mailConfig.port, //
                Credentials = new System.Net.NetworkCredential("notification@allianz.ng", "Allianz1234"), //mailConfig.username, mailConfig.password
                                                                                                         
                DeliveryMethod = SmtpDeliveryMethod.Network,
                EnableSsl = true, //mailConfig.isSSL,// = 
                Host = "smtp.office365.com", //mailConfig.smtp //= 

            })
            using (var mail = new MailMessage())
            {
                mail.To.Add(recipient);
                mail.Subject = subject;
                mail.Body = body;
                mail.IsBodyHtml = true;
                foreach (var item in filePath)
                {
                    var attachment = new Attachment(item);
                    mail.Attachments.Add(attachment);
                }

                //mail.From = new MailAddress("Anchor <" + "segxy2708@hotmail.com" + ">");
                mail.From = new MailAddress("Allianz <" + "notification@allianz.ng" + ">");
                try
                {
                    client.Send(mail);
                    return true;
                }
                catch (Exception ex)
                {
                    var p = ex.Message;
                    return false;
                }

            }

        }
    }


}
