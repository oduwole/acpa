
jQuery(document).ready(function () {

    
    $('input.checkbox').on("input change keyup paste mouseup", function (e) {
        var checkProd = $(this).val();
        hideAll();
        $('.' + checkProd).show();
        console.log($(this).val());
        localStorage.setItem("selectedProduct", $(this).val());
        
        localStorage.setItem("type", 'Claims');

    });
});

function hideAll() {
    $('.fire').hide();
    $('.allrisk').hide();
    $('.burglary').hide();
}

var selectedOptions = [];
    var form = $("#example-form");
        form.validate({
        errorPlacement: function errorPlacement(error, element) {element.before(error); },
            rules: {
        confirm: {
        equalTo: "#password"
                },
                //OfficeEmail: {emailvalidator: true, required: true },
                'radios[]': {required: true }//,
                //'home[]': {required: true },
                //'travel[]': {required: true },
                //'motor[]': {required: true },
                //'epp[]': {required: true },
                //'domestic[]': {required: true }
            }
        });
        form.children("div").steps({
        headerTag: "h3",
            bodyTag: "section",
            transitionEffect: "slideLeft",
            labels: 
            {
                finish: "Go",
                previous: "",
            },
            onStepChanging: function (event, currentIndex, newIndex) {
        form.validate().settings.ignore = ":disabled,:hidden";

                // Always allow going backward even if the current step contains invalid fields!
                if (currentIndex > newIndex) {
                    return true;
                }
                //var form = $(this);

                // Clean up if user went backward before
                if (currentIndex < newIndex) {
        // To remove error styles
        $(".body:eq(" + newIndex + ") label.error", form).remove();
                    $(".body:eq(" + newIndex + ") .error", form).removeClass("error");
                }

                /*var nextStep = '#example-form #example-form-p-' + newIndex;
                var heightNextStep = $(nextStep).css('minHeight');
                            $(nextStep).parent().animate({
        height: heightNextStep
                }, 200);*/
                $('.current').css('minHeight');
                //console.log(selectedOptions);
                selectedOptions = localStorage.getItem("selectedProduct");
                //loadSelectedOptionItems(selectedOptions);
                //loadDetails();
                return form.valid();
            },
            onFinishing: function (event, currentIndex) {
        //form.validate().settings.ignore = ":disabled";
        //return form.valid();
        selectedOptions = localStorage.getItem("selectedProduct");
                console.log(selectedOptions);
                window.location.href =  'Claims/' + selectedOptions + '.html'
                savePosting(selectedOptions);
            },
            onFinished: function (event, currentIndex) {
        alert("Submitted!");
            }
        });