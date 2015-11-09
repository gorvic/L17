( function($) {


( function() {
    var h = $("#panel1").height();
    $("#panel2").height(h);
} )();

//cashed variables
//# = native browser method getElementById(), that's fastest.
//$(tag) = getElementsByTagName().

//info
var $container = $('#container');
var $containerButton = $container.children('button.btn-sm'); //prefix class by tag
var $containerInfo = $('#container_info');

//form fields and buttons
var $submitButton = $('#submit_button');
var $form = $('#ads_form');


var $formFields = $form.find('input:text, input:password, input:file, #email, select, textarea');
var $formRadiosAndCheckboxes = $form.find('input:radio, input:checkbox');

var $organizationFormId = $form.find('[name="organization_form_id"]');


var $organizationFormIdByValue = [
    $form.find('[name="organization_form_id"][value = "0"]'),
    $form.find('[name="organization_form_id"][value = "1"]')

]

var $table = $('#ads_table');

var options = {
    target: '#container_info', // target element(s) to be updated with server response 
    success: successSubmit, // post-submit callback 

    // other available options: 
    url: 'index.php', // override for form's 'action' attribute 
    dataType: 'json', // 'xml', 'script', or 'json' (expected server response type) 
    clearForm: false, // clear all form fields after successful submit 
    resetForm: true // reset the form after successful submit 
};
$form.ajaxForm(options);

function info(response) {

    if (response.status == 'success') {
        $container.removeClass('alert-danger').addClass('alert-info');
        $containerButton.removeClass('btn-danger').addClass('btn-info')
        $containerInfo.html(response.message);
        $container.fadeIn('slow');
    } else if (response.status == 'error') {
        $container.removeClass('alert-info').addClass('alert-danger');
        $containerButton.removeClass('btn-info').addClass('btn-danger')
        $containerInfo.html(response.message);
        $container.fadeIn('slow');
    }

    ( function() {
        setTimeout(function() {
            $container.fadeOut("slow")
        }, 2000);
    } )();
}

function successSubmit(response, textStatus, xhr) {

    var $hiddenField = $('#hiddenField'),
        isEditMode = $hiddenField.length ? true : false;

    info(response);
    if (response.status == 'success') { //fill table
        //if isEditMode get tr element in table for updating
        if (isEditMode) {

            //delete hidden field, if exists
            $hiddenField.remove();
            $table.find('tr[id=' + $hiddenField.val() + ']').replaceWith(response.data);

        } else {
            //append new tr
            $table.find('tr').last().after(response.data);
        }
    }
}

function clearForm() {
    $formFields.val('');
    $formRadiosAndCheckboxes
        .removeAttr('checked').removeAttr('selected');

    $('#location_id')[0].selectedIndex = 0;
    $('#category_id')[0].selectedIndex = 0;
    $organizationFormId[0].checked = true;
    $submitButton.html('Добавить');

    var $hiddenField = $('#hiddenField');
    if ($hiddenField.length) {
        $hiddenField.remove();
    }
}

//event delegation
$('tbody').on('click', 'a.btn.btn-danger', function() {

    var isEditMode = $('#hiddenField').length ? true : false;
    if (isEditMode) {
        $containerInfo.html('First finish updating your current ad');
        $container.fadeIn('slow');
        return false;
    }

    var $row = $(this).closest('tr');
    var id = $row[0].getAttribute('id');

    var url = 'index.php';
    var data = {
        'id': id,
        'mode': 'delete'
    };


    $.getJSON(url, data, function(response) {

        $row.fadeOut('slow', info(response)).remove();

    });

}).on('click', 'a.btn.btn-success', function() { //Edit form

    var $row = $(this).closest('tr');
    var id = $row[0].getAttribute('id');

    var url = 'index.php';
    var data = {
        'id': id,
        'mode': 'show'
    }

    $.getJSON(url, data, function(response) {


        $.each(response.data, function(name, value) {

            if (name == 'allow_mails') {
                $('#allow_mails')[0].checked = (value == 1) ? true : false;
                return true;
            } else if (name == 'organization_form_id') {
                $organizationFormIdByValue[value][0].checked = true;
                return true;
            } else if (name == 'id') {
                $('#hiddenField').remove();
                //$hiddenField = 
                $('<input>',
                    {
                        type: 'hidden',
                        id: 'hiddenField',
                        name: 'id',
                        value: value
                    }
                ).appendTo('.btn-group.btn-group-md');
                $submitButton.html('Записать изменения');
                return true;
            }
            $('#' + name).val(value);

        }); // end of each()
    });
});

$('#cancel_button').on('click', function() {

    clearForm();


});
} )(jQuery);