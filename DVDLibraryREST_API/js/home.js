$(document).ready(function () {
  loadDvd();
});

function loadDvd() {
    clearDvdTable();
    var contentRows = $('#contentRows');

    $.ajax({
        type: 'GET',
        url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvds',
        success: function (dvdArray) {
            $.each(dvdArray, function(index, dvd) {
                var id = dvd.id;
                var title = dvd.title;
                var releaseYear = dvd.releaseYear;
                var director = dvd.director;
                var rating = dvd.rating;
                var notes = dvd.notes;

                var row = '<tr>';
                row += '<td><a onclick="displayDetails(' + id + ')">' + title + '</a></td>';
                row += '<td>' + releaseYear + '</td>';
                row += '<td>' + director + '</td>';
                row += '<td>' + rating + '</td>';
                row += '<td><button type="button" class="btn btn-warning" onclick="showEditForm(' + id + ')">Edit</button> <button type="button" class="btn btn-danger" onclick="deleteAlert(' + id + ')">Delete</button></td>';
                row += '</tr>';

                contentRows.append(row);
            });
        },
        error: function () {
            $('#errorMessages')
                .append($('<li>')
                .attr({ class: 'list-group-item list-group-item-danger' })
                .text('Error calling web service. Please try again later.'));
        }
    });
}

function clearDvdTable() {
    $('#contentRows').empty();
}

function showCreateForm() {
    $('#errorMessages').empty();
    $('#initialState').hide();
    $('#createDvd').show();
}

function hideCreateForm() {
    $('#errorMessages').empty();
    $('#createDvd').hide();
    $('#createTitle').val('');
    $('#createReleaseYear').val('');
    $('#createDirector').val('');
    $('#createRating').val('');
    $('#createNotes').val('');
    $('#initialState').show();
}

function showEditForm(id) {
    $('#errorMessages').empty();

    $.ajax({
        type: 'GET',
        url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/' + id,
        success: function (DVD, status) {
            $('#editHeader').text("Edit Title: " + dvd.title);
            $('#editId').val(dvd.id);
            $('#editTitle').val(dvd.title);
            $('#editReleaseYear').val(dvd.releaseYear);
            $('#editDirector').val(dvd.director);
            $('#editRating').val(dvd.rating);
            $('#editNotes').val(dvd.notes);
        },
        error: function () {
            $('#errorMessages')
                .append($('<li>')
                .attr({ class: 'list-group-item list-group-item-danger' })
                .text('Error calling web service.  Please try again later.'));
        }
    });

    $('#initialState').hide();
    $('#editDvd').show();
}

$('#editSaveButton').click(function (event) {
    $('#errorMessages').empty();
    var haveValidationErrors = checkEditInputErrors($('#editDvd').find('input'));

    if (/^[0-9]{4}$/.test($('#editReleaseYear').val()) == false) {
        $('#errorMessages')
            .append($('<li>')
            .attr({ class: 'list-group-item list-group-item-danger' })
            .text('Please enter a 4-digit year.'));

        return false;
    }

    if (haveValidationErrors) {
        return false;
    }

    $.ajax({
        type: 'PUT',
        url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/' + $('#editId').val(),
        data: JSON.stringify({
            id: $('#editId').val(),
            title: $('#editTitle').val(),
            releaseYear: $('#editReleaseYear').val(),
            director: $('#editDirector').val(),
            rating: $('#editRating').val(),
            notes: $('#editNotes').val()
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        'datatype': 'json',
        'success': function () {
            $('#errorMessages').empty();
            loadDvd();
            hideEditForm();
        },
        'error': function () {
            $('#errorMessages')
                .append($('<li>')
                .attr({ class: 'list-group-item list-group-item-danger' })
                .text('Error calling web service.  Update DVD did not succeed.'));
        }
    })
})

function hideEditForm() {
    $('#errorMessages').empty();
    $('#editDvd').hide();
    $('#initialState').show();
}

$('#createAddButton').click(function (event) {
    $('#errorMessages').empty();

    var haveValidationErrors = checkCreateInputErrors($('#createDvd').find('input'));

    if (/^[0-9]{4}$/.test($('#createReleaseYear').val()) == false) {
        $('#errorMessages')
            .append($('<li>')
            .attr({ class: 'list-group-item list-group-item-danger' })
            .text('Please enter a 4-digit year.'));

        return false;
    }

    if (haveValidationErrors) {
        return false;
    }

    $.ajax({
        type: 'POST',
        url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd',
        data: JSON.stringify({
            title: $('#createTitle').val(),
            director: $('#createDirector').val(),
            releaseYear: $('#createReleaseYear').val(),
            rating: $('#createRating').val(),
            notes: $('#createNotes').val()
        }),
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        'dataType': 'json',
        success: function (data, status) {
            $('#errorMessages').empty();
            $('#createTitle').val('');
            $('#createDirector').val('');
            $('#createReleaseYear').val('');
            $('#createRating').val('');
            $('#createNotes').val('');
            loadDvd();
            hideCreateForm();
        },
        error: function () {
            $('#errorMessages')
                .append($('<li>')
                .attr({ class: 'list-group-item list-group-item-danger' })
                .text('Error calling web service.  Please try again later.'));
        }
    });
});

function displayDetails(id) {
    $('#errorMessages').empty();
    $('#initialState').hide();
    $('#displayDetails').show();

    $.ajax({
        type: 'GET',
        url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/' + id,
        success: function (dvd) {
            $('#displayTitle').text(dvd.title);
            $('#displayReleaseYear').text(dvd.releaseYear);
            $('#displayDirector').text(dvd.director);
            $('#displayRating').text(dvd.rating);
            $('#displayNotes').text(dvd.notes);

        },
        error: function () {
            $('#errorMessages')
                .append($('<li>')
                .attr({ class: 'list-group-item list-group-item-danger' })
                .text('Error calling web service. Please try again later.'));
        }
    });
}

function hideDetails() {
    $('#initialState').show();
    $('#displayDetails').hide();
}

function deleteAlert(id) {
    if (confirm('Are you sure you want to delete this DVD from your collection?')) {
        deleteDvd(id)
    }
}

function deleteDvd(id) {
    $.ajax({
        type: 'DELETE',
        url: "http://dvd-library.us-east-1.elasticbeanstalk.com/dvd/" + id,
        success: function (status) {
            loadDvd();
        }
    })
}

function searchDvd() {
    $('#errorMessages').empty();

    var contentRows = $('#contentRows');

    if ($('#searchCategory').val() == '' || $('#searchTerm').val() == '') {

        $('#errorMessages')
            .append($('<li>')
            .attr({ class: 'list-group-item list-group-item-danger' })
            .text('Both Search Category and Search Term are required.'));
        return;
    }
    else if ($('#searchCategory').val() === 'title') {
        $.ajax({
            type: 'GET',
            url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/title/' + $('#searchTerm').val(),
            success: function (dvdArray) {
                clearDvdTable();
                $.each(dvdArray, function (index, DVD) {
                    var title = dvd.title;
                    var releaseYear = dvd.releaseYear;
                    var director = dvd.director;
                    var rating = dvd.rating;
                    var id = dvd.id;

                    var row = '<tr>';
                    row += '<td><a onclick="displayDetails(' + id + ')">' + title + '</a></td>';
                    row += '<td>' + releaseYear + '</td>';
                    row += '<td>' + director + '</td>';
                    row += '<td>' + rating + '</td>';
                    row += '<td><button type="button" class="btn btn-warning" onclick="showEditForm(' + id + ')">Edit</button> <button type="button" class="btn btn-danger" onclick="deleteAlert(' + id + ')">Delete</button></td>';
                    row += '</tr>';

                    contentRows.append(row);
                })
            },
            error: function () {
                $('#errorMessages')
                    .append($('<li>')
                    .attr({ class: 'list-group-item list-group-item-danger' })
                    .text('Error calling web service. Please try again later.'));
            }
        })
    }
    else if ($('#searchCategory').val() === 'year') {
        $.ajax({
            type: 'GET',
            url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvds/year/' + $('#searchTerm').val(),
            success: function (dvdArray) {
                clearDvdTable();
                $.each(dvdArray, function (index, dvd) {
                    var id = dvd.id;
                    var title = dvd.title;
                    var releaseYear = dvd.releaseYear;
                    var director = dvd.director;
                    var rating = dvd.rating;

                    var row = '<tr>';
                    row += '<td><a onclick="displayDetails(' + id + ')">' + title + '</a></td>';
                    row += '<td>' + releaseYear + '</td>';
                    row += '<td>' + director + '</td>';
                    row += '<td>' + rating + '</td>';
                    row += '<td><button type="button" class="btn btn-warning" onclick="showEditForm(' + id + ')">Edit</button> <button type="button" class="btn btn-danger" onclick="deleteAlert(' + id + ')">Delete</button></td>';
                    row += '</tr>';

                    contentRows.append(row);
                })
            },
            error: function () {
                $('#errorMessages')
                    .append($('<li>')
                    .attr({ class: 'list-group-item list-group-item-danger' })
                    .text('Error calling web service. Please try again later.'));
            }
        })
    }
    else if ($('#searchCategory').val() === 'director') {
        $.ajax({
            type: 'GET',
            url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvds/director/' + $('#searchTerm').val(),
            success: function (dvdArray) {
                clearDvdTable();
                $.each(dvdArray, function (index, dvd) {
                    var id = dvd.id;
                    var title = dvd.title;
                    var releaseYear = dvd.releaseYear;
                    var director = dvd.director;
                    var rating = dvd.rating;

                    var row = '<tr>';
                    row += '<td><a onclick="displayDetails(' + id + ')">' + title + '</a></td>';
                    row += '<td>' + releaseYear + '</td>';
                    row += '<td>' + director + '</td>';
                    row += '<td>' + rating + '</td>';
                    row += '<td><button type="button" class="btn btn-warning" onclick="showEditForm(' + id + ')">Edit</button> <button type="button" class="btn btn-danger" onclick="deleteAlert(' + id + ')">Delete</button></td>';
                    row += '</tr>';

                    contentRows.append(row);
                })
            },
            error: function () {
                $('#errorMessages')
                    .append($('<li>')
                    .attr({ class: 'list-group-item list-group-item-danger' })
                    .text('Error calling web service. Please try again later.'));
            }
        })
    }
    else if ($('#searchCategory').val() === 'rating') {
        $.ajax({
            type: 'GET',
            url: 'http://dvd-library.us-east-1.elasticbeanstalk.com/dvds/rating/' + $('#searchTerm').val(),
            success: function (dvdArray) {
                clearDvdTable();
                $.each(dvdArray, function (index, dvd) {
                    var id = dvd.id;
                    var title = dvd.title;
                    var releaseYear = dvd.releaseYear;
                    var director = dvd.director;
                    var rating = dvd.rating;

                    var row = '<tr>';
                    row += '<td><a onclick="displayDetails(' + id + ')">' + title + '</a></td>';
                    row += '<td>' + releaseYear + '</td>';
                    row += '<td>' + director + '</td>';
                    row += '<td>' + rating + '</td>';
                    row += '<td><button type="button" class="btn btn-warning" onclick="showEditForm(' + id + ')">Edit</button> <button type="button" class="btn btn-danger" onclick="deleteAlert(' + id + ')">Delete</button></td>';
                    row += '</tr>';

                    contentRows.append(row);
                })
            },
            error: function () {
                $('#errorMessages')
                    .append($('<li>')
                    .attr({ class: 'list-group-item list-group-item-danger' })
                    .text('Error calling web service. Please try again later.'));
            }
        })
    }
}

function checkInitialStateInputErrors(input) {
    $('#errorMessages').empty();
    var errorMessages = [];

    input.each(function () {
        if (!this.validity.valid) {
            var errorField = $('label[for=' + this.id + ']').text();
            errorMessages.push(errorField + ' ' + this.validationMessage);
        }
    });

    if (errorMessages.length > 0) {
        $.each(errorMessages, function (index, message) {
            $('#errorMessages').append($('<li>').attr({ class: 'list-group-item list-group-item-danger' }).text(message));
        });
        return true; // true means there were errors
    } else {
        return false; // false means there were no errors
    }
}

function checkEditInputErrors(input) {
    $('#errorMessages').empty();
    var errorMessages = [];

    input.each(function () {
        if (!this.validity.valid) {
            var errorField = $('label[for=' + this.id + ']').text();
            errorMessages.push(errorField + ' ' + this.validationMessage);
        }
    });

    if (errorMessages.length > 0) {
        $.each(errorMessages, function (index, message) {
            $('#errorMessages').append($('<li>').attr({ class: 'list-group-item list-group-item-danger' }).text(message));
        });
        return true; // true means there were errors
    } else {
        return false; // false means there were no errors
    }
}

function checkCreateInputErrors(input) {
    $('#errorMessages').empty();
    var errorMessages = [];

    input.each(function () {
        if (!this.validity.valid) {
            var errorField = $('label[for=' + this.id + ']').text();
            errorMessages.push(errorField + ' ' + this.validationMessage);
        }
    });

    if (errorMessages.length > 0) {
        $.each(errorMessages, function (index, message) {
          $('#errorMessages').append($('<li>').attr({ class: 'list-group-item list-group-item-danger' }).text(message));
        });
        return true; // true means there were errors
    } else {
        return false; // false means there were no errors
    }
}
