'use strict';

function ajaxReq(url, method, data, handleSuccess, handleError, isPublic) {
  const settings = {
    url,
    dataType: 'json',
    contentType: 'application/json',
    method
  }

  if (data) {
    settings.data = JSON.stringify(data);
  }

  if (!isPublic) {
    settings.headers = {
      'Authorization': `Bearer ${authState.authToken}`
    }
  }

  $.ajax(settings)
  .done(handleSuccess)
  .fail(handleError);
}

function requestDataAPI(aFunction, method, id, data) {
  let url = '/employees';

  if (id) {
    url = url + '/' + id;
  }

  const settings = {
    url,
    dataType: 'json',
    contentType: 'application/json',
    data: JSON.stringify(data),
    method: method,
    beforeSend: function (xhr) {
      xhr.setRequestHeader('Authorization', 'Bearer ' + userState.authToken)
    }
  }

  $.ajax(settings)
  .done(aFunction)
  .fail((err)=>{
    console.log('Failed response',err);
  });
}

function resetStorage(){
  clearAllInputs();
  clearEquipList();
  resetFormState();
}

function showElement(selector) {
  $(selector).show();
}

function hideElement(selector) {
  $(selector).hide();
}

function handleDelete() {
  $('.js-verify-delete').html(`
    <p>Employee has been deleted</p>
    <button class="js-close-deleted close">Close</button>
  `);
  requestDataAPI(handleResGET, 'GET', null);
}

function verifyDeleteButtonNo() {
  $('.js-message-box').on('click', '.js-verify-no', event => {
    requestDataAPI(handleResGET, 'GET', null);
    $('.js-message-box').empty();
  });
}

function verifyDeleteButtonYes() {
  $('.js-message-box').on('click', '.js-verify-yes', () => {

    const anID = employeeFormState.id;
    requestDataAPI(handleDelete,'DELETE',anID);

    delete employeeFormState.id;
    $('.js-message-box').empty();
  });
}


function employeeDeleteButton() {
  $('.js-employees').on('click', '.js-delete-employee', function(event) {
    const employeeID = $(this)
      .closest('.js-employee-list')
      .attr('employee-id');

    employeeFormState.id = employeeID;

    const selectedEmployee =  $(this)
      .closest('.js-employee-list')
      .find('.js-employee-name').text();

    renderVerifyDelete(selectedEmployee);

    $('.js-empty').empty();
  });
}

function selectEmployeeCerts(certs) {
  certs.forEach(cert => {
    $(`#${cert}`).prop('checked', true);
  })
}

function clearAllInputs() {
  $('input[type=text]').val('');
  $('.js-add-notes').val('');
  $('.js-contact').val('');
  $('input[type=checkbox]').prop('checked', false);
}

function closeCreatedMessageButton() {
  $('.js-message-box').on('click', '.js-close-created-button', () => {
      
    $('.js-message-box').empty();
    requestDataAPI(handleResGET, 'GET', null);
  });
}

function docReady() {
  closeCreatedMessageButton();
}

$(docReady);