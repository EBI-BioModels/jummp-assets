const $loading = $('#loading');
$(document)
    .ajaxStart(function () {
        $loading.show();
    })
    .ajaxStop(function () {
        $loading.hide();
    });
$(document).ready(function () {
    console.log("Step: " + initialStep);
    let current_fs, next_fs, previous_fs; //fieldsets
    let opacity;
    let current = initialStep;
    let steps = $("fieldset").length;
    steps = 5;
    setProgressBar(current, steps);
    /*$("#progressbar li").eq(current).addClass("active");
    $("#" + getFSId(current)).show();*/
    $(".next").click(function () {
        validateData(current);
        let step;
        current_fs = $(this).parent();
        next_fs = current_fs.next();
        if (currentValidation) {
            // Add Class Active
            //console.log("before: " + current);
            $("#progressbar li").eq(current++).addClass("active");
            //console.log("after: " + current);

            // show the next fieldset
            next_fs.show();
            window.history.replaceState(null, null, '?step=' + current);
            // hide the current fieldset with style
            current_fs.animate({opacity: 0}, {
                step: function (now) {
                    // for making fieldset appear animation
                    opacity = 1 - now;

                    current_fs.css({
                        'display': 'none',
                        'position': 'relative'
                    });
                    next_fs.css({'opacity': opacity});
                },
                duration: 500
            });
            setProgressBar(current, steps);
            step = current - 1;
            clearErrorMessages();
            updateSubFormAtStep(current);
        } else {
            showErrorMessages();
            step = current;
        }
        // tick or cross the previous or current step if the validation is valid or invalid respectively
        setCheckList(step, currentValidation);
    });

    $(".previous").click(function () {
        current--;
        current_fs = $(this).parent();
        previous_fs = $(this).parent().prev();

        // Remove class active
        $("#progressbar li").eq($("fieldset").index(current_fs)).removeClass("active");
        $("#progressbar li").eq(current).removeClass("active");
        window.history.replaceState(null, null, '?step=' + current);
        // show the previous fieldset
        previous_fs.show();
        // hide the current fieldset with style
        current_fs.animate({opacity: 0}, {
            step: function (now) {
            // for making fieldset appear animation
                opacity = 1 - now;

                current_fs.css({
                    'display': 'none',
                    'position': 'relative'
                });
                previous_fs.css({'opacity': opacity});
            },
            duration: 500
        });
        setProgressBar(current, steps);
    });

    $(".submit").click(function () {
        return false;
    });

    function hideAllInvalidIcons() {
        $('.fa-times-circle').hide();
        $('.fa-check-circle-o').hide();
    }

    hideAllInvalidIcons();

    function showErrorMessages() {
        if (errorMessages.length) {
            let messages = "<ul>";
            for (i = 0; i < errorMessages.length; i++) {
                console.log(errorMessages[i]);
                messages += "<li>" + errorMessages[i] + "</li>";
            };
            messages += "</ul>";
            $('.flashNotificationDiv').html(messages).show();
        }
    }

    function clearErrorMessages() {
        errorMessages = [];
        $('.flashNotificationDiv').html("").hide();
    }

    function updateSubFormAtStep(step) {
        switch (step) {
            case 1:
                break;
            case 2:
                // defined in the step 2
                console.log("Updating the model info form at the step " + step);
                updateModelInfoForm();
                break;
            case 3:
                console.log("Updating the publication form at the step " + step);
                break;
            case 4:
                // defined in the step 4
                console.log("Displaying the summary screen at the step " + step);
                populateSummaryData();
                break;
            case 5:
                // defined in the step 4
                console.log("Completing the submission/update process at the step " + step);
                completeSubmission();
                break;
            default:
                break;
        }
    }

    function validateData(step) {
        switch (step) {
            case 1:
                validateFileUpload();
                break;
            case 2:
                validateModelInfo();
                break;
            case 3:
                validatePublicationInfo();
                break;
            case 4:
                submitData();
                break;
            default:
                break;
        }
    }

    function getFSId(step) {
        let fsId;
        switch (step) {
            case 1:
                fsId = "submission-file-upload";
                break;
            case 2:
                fsId = "submission-model-info";
                break;
            case 3:
                fsId = "submission-publication-details";
                break;
            case 4:
                fsId = "submission-summary-display";
                break;
            default:
                break;
        }
        return fsId;
    }
});

function setProgressBar(curStep, totalSteps) {
    let percent = (100 / totalSteps) * curStep;
    percent = percent.toFixed();
    $(".progress-meter").css("width", percent + "%");
}

function setCheckList(curStep, isValid) {
    console.log("ticked/crossed at the step " + curStep + " --- isValid: " + isValid);
    if (isValid) {
        $('#step' + curStep + ' .fa-times-circle').hide();
        $('#step' + curStep + ' .fa-check-circle-o').show();
    } else {
        $('#step' + curStep + ' .fa-check-circle-o').hide();
        $('#step' + curStep + ' .fa-times-circle').show();
    }
}
