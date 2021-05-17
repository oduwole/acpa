//var apiBase = 'https://localhost:44307';
var apiBase = 'https://allianzefapi.lineamentconcepts.com'
var width = $(document).width();
var fileStore = [];
var myFiles = [];
var formData = new FormData();
var policyno = '';

$(function(){
    $('#blah').hide();
    $('#blah1').hide();
    $('#blah2').hide();

    /*document.querySelectorAll('.textarea').forEach(item => {
        item.addEventListener('keyup', event => {
            //$(item).height($(item).prop("scrollHeight")) 
        })
      })*/

      document.querySelectorAll('input').forEach(item => {
        item.addEventListener('change', event => {
            console.log(event.target.id)
            if(event.target.id == 'file1'){
                $('#blah1').show();
            console.log(item);
            readURL(item, 'blah1');
            } else if(event.target.id == 'file2'){
                $('#blah2').show();
            console.log(item);
            readURL(item, 'blah2');
        } else if(event.target.id == 'afixPix'){
            //$('#output').show();
        //console.log(item);
        readURL(item, 'output');
            }else{
                $('#blah').show();
                console.log(item);
                readURL(item, 'blah');
            }
            
        })
      })

      document.querySelectorAll('textarea').forEach(item => {
        item.addEventListener('keyup', event => {
            //console.log(event.target.id)
            setHeight(event.target.id);
            //$(item).height($(item).prop("scrollHeight") + 'px') 
        })
      })
    
      document.querySelectorAll('textarea').forEach(item => {
        item.addEventListener('keydown', event => {
            setHeight(event.target.id);
        })
      })
    $('#submitinfo').click(function(e){
        $('#myModal').modal('show');
       //
        //demoFromHTML();        
    });
})

function setHeight(fieldId){
    //document.getElementsByName(fieldId).style.height = document.getElementsByName(fieldId).scrollHeight+'px';
    document.getElementById(fieldId).style.height = document.getElementById(fieldId).scrollHeight+'px';
}
//setHeight('textBox1');

function _setHeight(jq_in){
    jq_in.each(function(index, elem){
        // This line will work with pure Javascript (taken from NicB's answer):
        elem.style.height = elem.scrollHeight+'px'; 
    });
}

function demoFromHTML() {
    //var pdf = new jsPDF('landscape');
    console.log($(document).width())
    console.log($(document).height())
    if ($(document).width() > $(document).height()) {
        //var pdf = new jsPDF('l', 'pt', [$(document).width() + 190, $(document).height() + 1175]);
        var pdf = new jsPDF('l', 'pt', [$(document).width(), $(document).height()]); //
    }
    else {
        
        //var pdf = new jsPDF('p', 'pt', [$(document).width(), $(document).height()]);
        var pdf = new jsPDF('l', 'pt', [$(document).height(), $(document).width()]);
    }
    //var pdf = new jsPDF('p', 'pt', 'a4');
    //pdf.autoTable({ html: '#html-2-pdfwrapper' });
    var totalPages = pdf.internal.getNumberOfPages();

    /*for (i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        //doc.addImage(imgData, 'PNG', 40, 40, 75, 75);
        pdf.setTextColor(150);
        pdf.text(50, pdf.internal.pageSize.height - 30, 'Allianz Insurance NG');
    }*/
    pdf.html(document.getElementById('html-2-pdfwrapper'), {
        callback: function (pdf) {
            var iframe = document.createElement('iframe');
            //iframe.setAttribute('style', 'position:absolute;right:0; top:0; bottom:0; height:100%; width:1400px');
            iframe.setAttribute('style', 'position:absolute;right:20px; left:20px; top:0; bottom:0; height:100%; width:900px; allowfullscreen');
            document.body.appendChild(iframe);
            //pdf.save();
            var filename = localStorage.getItem('selectedProduct');
            pdf.save(filename);
            iframe.src = pdf.output('datauristring');
        }
    });

}

function generatePDF() {
    var type = localStorage.getItem('type');
    var transUrl =  '';
    if(type == 'proposals'){
        transUrl =  '/api/proposal/proposals'
    }else{
        transUrl =  '/api/claim/claims';
    }
    processUpload();
    var data = document.getElementById('html-2-pdfwrapper');
    var data_width = document.getElementById('html-2-pdfwrapper').clientWidth;
    html2canvas(document.querySelector('#html-2-pdfwrapper')).
        then(canvas => {
            var imgWidth = data_width;
            var imgHeight = canvas.height * imgWidth / canvas.width;
            const contentDataURL = canvas.toDataURL('image/jpg', 0.5);
            let pdf = new jsPDF('p', 'pt', [imgWidth + 10, imgHeight + 10], true);
            pdf.addImage(contentDataURL, 'PNG', 5, 5, imgWidth, imgHeight, undefined, 'FAST');
            let mydate = new Date()
            let month = mydate.getUTCMonth() + 1;
            let formatedDate = mydate.getUTCDate() + "_" + month + "_" + mydate.getFullYear();
            let fileName = formatedDate + '_' + 'Calendario_' + 'Darzalex_' ;//+ this._pdetails.Tratamientos
            //pdf.save(fileName + ".pdf");
            var binary = pdf.output();
            var ppd = binary ? btoa(binary) : "";
            var reqData = {
                to: email,
                attachment: ppd,
                type: localStorage.getItem('type'),
                product: localStorage.getItem('selectedProduct')
            };
            NProgress.start();
            $.ajax({
                url: apiBase + transUrl,
                data: JSON.stringify(reqData),
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (response) {
                    //progress.done();
                    NProgress.done();

                    $('#sendemail').removeClass('disabled');
                    if (response.result === "success") {
                        $('#myModal').modal('hide');
                        $('#remail').val('');

                        toastr.success("Mail send succesfully!");
                    }
                    else
                        toastr.error("There seems to be a problem, Please try again!");

                },
                error: function () {
                    NProgress.done();
                    $('#sendemail').removeClass('disabled');
                    toastr.error("Error in communicating with server!");
                }
            });
        });
}

function sendPdfMail_(email){
    $('.container').css('width','1200%');
        /*if(width < 401){
            $('body').css('zoom','200%');
            $('body').css('zoom','2');
            //$('body').css('-moz-transform',scale(0.8, 0.8));
        }else if(width <641){
            $('body').css('zoom','150%');
            $('body').css('zoom','1.5');
            //$('body').css('-moz-transform',scale(0.8, 0.8));
        }else if(width < 769){
            $('body').css('zoom','100%');
            $('body').css('zoom','1');
            //$('body').css('-moz-transform',scale(0.8, 0.8));
        }else{

        }*/
        generatePDF();
        console.log(e);
        setTimeout(function(){ 
            $('.container').css('width', width);
         }, 10000);
}

function sendPdfMail(email) {
    var type = localStorage.getItem('type');
    var transUrl =  '';
    if(type == 'proposals'){
        transUrl =  '/api/proposal/proposals'
    }else{
        transUrl =  '/api/claim/claims';
    }
    processUpload();
    var pdf = new jsPDF('l', 'pt', [$(document).height() + 590, $(document).width() + 190]);
    var totalPages = pdf.internal.getNumberOfPages();

    for (i = 1; i <= totalPages; i++) {
        pdf.setPage(i);
        pdf.setTextColor(150);
        pdf.text(50, pdf.internal.pageSize.height - 30, 'Allianz Insurance NG');
    }
    pdf.html(document.getElementById('html-2-pdfwrapper'), {
        callback: function (pdf) {
            var iframe = document.createElement('iframe');
            iframe.setAttribute('style', 'position:absolute;right:20px; left:0px; top:0; bottom:0; height:100%; width:900px; allowfullscreen');
            document.body.appendChild(iframe);
            //pdf.save();
            //pdf.save('debitnote.pdf');
            console.log(pdf);
            var binary = pdf.output();
            var ppd = binary ? btoa(binary) : "";
            var reqData = {
                to: email,
                attachment: ppd,
                type: localStorage.getItem('type'),
                product: localStorage.getItem('selectedProduct')
            };
            NProgress.start();
            $.ajax({
                url: apiBase + transUrl,
                data: JSON.stringify(reqData),
                dataType: "json",
                type: "POST",
                contentType: "application/json; charset=utf-8",
                success: function (response) {
                    //progress.done();
                    NProgress.done();

                    $('#sendemail').removeClass('disabled');
                    if (response.result === "success") {
                        $('#myModal').modal('hide');
                        $('#remail').val('');

                        toastr.success("Mail send succesfully!");
                    }
                    else
                        toastr.error("There seems to be a problem, Please try again!");

                },
                error: function () {
                    NProgress.done();
                    $('#sendemail').removeClass('disabled');
                    toastr.error("Error in communicating with server!");
                }
            });
        }
    });



}


function sendmail() {
    var email = $('#remail').val();
    $('#sendemail').addClass('disabled');
    //processUpload();
    sendPdfMail(email);
}

function readURL(input, id, status) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      
      reader.onload = function(e) {
        $('#'+id).attr('src', e.target.result);
      }
      
      reader.readAsDataURL(input.files[0]); // convert to base64 string
      console.log(input.files)
        myFiles.push(input.files[0]);
        fileStore.push(reader);
    }
  }

  function storeFileUpload(input, id) {
    if (input.files && input.files[0]) {
      var reader = new FileReader();
      
      reader.onload = function(e) {
        $('#'+id).attr('src', e.target.result);
      }
      
      reader.readAsDataURL(input.files[0]); // convert to base64 string
    }
  }

  
  $('img').change(function() {
    readURL(this);
  });

  function processUpload(){
    var prod = localStorage.getItem('selectedProduct');
    var policNo = '';
    var type =localStorage.getItem('type');
    var uploadUrl =  '';
    var fms = [];
    if(type == 'proposals'){
        uploadUrl =  '/api/proposal/upload'
        policNo = getInsuredName();
    }else{
        uploadUrl =  '/api/claim/upload';
        policNo = getPolicyNo();
    }
    
    var _formData = new FormData();
    
    //_formData.append("file", myFiles[0]);
    /*for (var index = 0; index < myFiles.length; index++) {
        
        var fm = myFiles[index];
        _formData.append("file" + index, myFiles[index]);
        //fms[index] =_formData;
    console.log(fileStore);
    console.log(_formData);
    }*/
    $.each($("input[type=file]"), function(i, obj) {
        $.each(obj.files,function(j, file){
            _formData.append('files', file);
        })
    });
    for (var key of _formData.entries()) {
       // console.log(key[0] + ', ' + key[1]);
       console.log(key);
    }
    $.ajax({
        url: apiBase +  uploadUrl + '?product=' + prod + '&policyno=' + policNo + '&type=' + type,
        data: _formData, // JSON.stringify(reqData),
        //dataType: "json",
        type: "POST",
        processData: false,  // tell jQuery not to process the data
       contentType: false,
        //contentType: "application/json; charset=utf-8",
        success: function (response) {
            //progress.done();
            NProgress.done();

            $('#sendemail').removeClass('disabled');
            /*if (response.result === "success") {
                $('#myModal').modal('hide');
                $('#remail').val('');

                toastr.success("file upload succesfully!");
            }
            else
                toastr.error("There seems to be a problem uploading files, Please try again!");
                */
                toastr.success("file attachment(s) upload succesfully!");

        },
        error: function () {
            NProgress.done();
            $('#sendemail').removeClass('disabled');
            toastr.error("Error in communicating with server!");
        }
    });
}

function getPolicyNo(){
    var polno = $('#policyno').val();
    var polnum = $('#policynumber').val();

    if(typeof polno == 'undefined'){
        return polnum;
    }else{
        if(typeof(polno.length) < 1){
            return polnum;
        }
        return polno;
    }
}

function getInsuredName(){
    var name = $('#name').val();
    var fullname = $('#surname').val() + ' ' + $('#firstname').val() + ' ' +$('#lastname').val();

    if(typeof name == 'undefined'){
        return fullname;
    }else{
        if(typeof(name.length) < 1){
            return fullname;
        }
        return name;
    }
}
var mtab = 2;
var subC = 2;
var disInc = 2;
function addMoreTable() {
    var table = document.getElementById("myTable");
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    cell1.innerHTML = "<input type=\"text\" placeholder=\"Principal Officer\" name=\"principalofficer\"" + mtab + " style=\"width: 100%;\" />";
    cell2.innerHTML = "<input type=\"text\" placeholder=\"Designation\" name=\"designation\"" + mtab + " style=\"width: 100%;\" />";
    cell3.innerHTML = "<input type=\"text\" placeholder=\"BVN\" name=\"BVN\"" + mtab + " style=\"width: 100%;\" />";
    mtab++
  }

  function removeMoreTable(){
    var table = document.getElementById("myTable");
    table.deleteRow(1);
    mtab--
  }

  
function addMoreSubsidiary() {
    var table = document.getElementById("subTable");
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    cell1.innerHTML = "<input type=\"text\" placeholder=\"Name\" name=\"subname\"" + subC + " style=\"width: 100%;\" />";
    cell2.innerHTML = "<input type=\"text\" placeholder=\"Business of SUbsidiary\" name=\"subsidName\"" + subC + " style=\"width: 100%;\" />";
    cell3.innerHTML = "<input type=\"text\" placeholder=\"Percentage\" name=\"perc\"" + subC + " style=\"width: 100%;\" />";
    cell4.innerHTML = "<input type=\"date\" placeholder=\"1-1-2000\" name=\"dateAcquired\"" + subC + " style=\"width: 100%;\" />";
    subC++
  }

  function removeMoreSubsidiary(){
    var table = document.getElementById("subTable");
    table.deleteRow(1);
    subC--
  }

  function addMoreDIncident() {
    var table = document.getElementById("disIncident");
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    var cell4 = row.insertCell(3);
    cell1.innerHTML = "<input type=\"date\" placeholder=\"1-1-2000\" name=\"dates" + disInc + "\" style=\"width: 100%;\" class=\"form-control\" />";
    cell2.innerHTML = "<textarea placeholder=\"Description\" name=\"description" + disInc + "\" style=\"width: 100%;\" class=\"form-control\"></textarea>";
    cell3.innerHTML = "<input type=\"number\" placeholder=\"0\" name=\"perc" + disInc + "\" style=\"width: 100%;\" class=\"form-control\" />";
    cell4.innerHTML = "<textarea placeholder=\"Preventive Measures\" name=\"dateAcquired" + disInc + "\" style=\"width: 100%;\" class=\"form-control\"></textarea>";
    disInc++
  }

  function removeDIncident(){
    var table = document.getElementById("disIncident");
    table.deleteRow(1);
    disInc--
  }

  function addMoreDirectors() {
    var table = document.getElementById("dorectors");
    var row = table.insertRow(1);
    var cell1 = row.insertCell(0);
    var cell2 = row.insertCell(1);
    var cell3 = row.insertCell(2);
    //var cell4 = row.insertCell(3);
    cell1.innerHTML = "<input type=\"text\" placeholder=\"Name\" name=\"dates" + disInc + "\" style=\"width: 100%;\" class=\"form-control\" />";
    cell3.innerHTML = "<textarea placeholder=\"Qualification\" name=\"qual" + disInc + "\" style=\"width: 100%;\" class=\"form-control\"></textarea>";
    cell2.innerHTML = "<input type=\"number\" placeholder=\"0\" name=\"age" + disInc + "\" style=\"width: 100%;\" class=\"form-control\" />";
    //cell4.innerHTML = "<textarea placeholder=\"Preventive Measures\" name=\"dateAcquired" + disInc + "\" style=\"width: 100%;\" class=\"form-control\"></textarea>";
    disInc++
  }

  function removeDirectors(){
    var table = document.getElementById("dorectors");
    table.deleteRow(1);
    disInc--
  }
  
  