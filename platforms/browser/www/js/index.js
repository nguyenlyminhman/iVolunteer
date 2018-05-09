/*
 * Licensed to the Apache Software Foundation (ASF) under one
 * or more contributor license agreements.  See the NOTICE file
 * distributed with this work for additional information
 * regarding copyright ownership.  The ASF licenses this file
 * to you under the Apache License, Version 2.0 (the
 * "License"); you may not use this file except in compliance
 * with the License.  You may obtain a copy of the License at
 *
 * http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing,
 * software distributed under the License is distributed on an
 * "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY
 * KIND, either express or implied.  See the License for the
 * specific language governing permissions and limitations
 * under the License.
 */


var app = {
    // Application Constructor
    initialize: function () {
        this.bindEvents();
    },
    // Bind Event Listeners
    //
    // Bind any events that are required on startup. Common events are:
    // 'load', 'deviceready', 'offline', and 'online'.
    bindEvents: function () {
        document.addEventListener('deviceready', this.onDeviceReady, false);
    },
    // deviceready Event Handler
    //
    // The scope of 'this' is the event. In order to call the 'receivedEvent'
    // function, we must explicitly call 'app.receivedEvent(...);'
    onDeviceReady: function () {
        initVolunteerDb();
    },
    // Update DOM on a Received Event

};
var iVDb;
var shortName = 'iVDb';
var version = '1.1.0';
var displayName = 'iVDb';
var maxSize = 5 * 1024 * 1024;

// this is called when an error happens in a transaction
function errorHandler(transaction, error) {
    alert('Error: ' + error.message + ' code: ' + error.code);
}

// this is called when a successful transaction happens
function successCallBack() {
    console.log("DEBUGGING: success");
}

function nullHandler() { }

function initVolunteerDb() {
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    iVDb = openDatabase(shortName, version, displayName, maxSize);
    iVDb.transaction(function (transaction) {
        transaction.executeSql('CREATE TABLE IF NOT EXISTS Volunteer (activity TEXT NOT NULL, location TEXT, a_date TEXT NOT NULL, a_time TEXT, name TEXT NOT NULL);',
            [], nullHandler, errorHandler);
    }, errorHandler, successCallBack);
}


function addNewVolunteer() {
    //Checking the device, which is not support database.
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    //get value from add new activity form.
    var activity = $('#activity').val();
    var location = $('#location').val();
    var date = $('#date').val();
    var time = $('#time').val();
    var volunteer = $('#volunteer').val();
    //check error when user enter new value.
    if (activity === '') {
        alert('You must enter the activity.');
        return;
    } else if (date === '') {
        alert('You must enter the date.');
        return;
    } else if (volunteer === '') {
        alert('You must enter the volunteer name.');
        return;
    } else {
        //show confirm dialog when values are true.
        var r = confirm('iVolunteer\n' +
            'Your entered information\n' +
            'Activity name: ' + activity +
            '\nLocation: ' + location +
            '\nDate: ' + date +
            '\nTime: ' + time +
            '\nVolunteer name: ' + volunteer
        );
        //when user accepted
        if (r == true) {
            //this section use to store all value to database.
            iVDb.transaction(function (transaction) {
                transaction.executeSql('INSERT INTO Volunteer (activity, location, a_date, a_time, name) values (?, ?, ?, ?, ?)', [activity, location, date, time, volunteer],
                    nullHandler, errorHandler);
            })
            //set all text field to null.
            $('#activity').val('');
            $('#location').val('');
            $('#date').val('');
            $('#time').val('');
            $('#volunteer').val('');
        }
        return;
    }
}
//this is called when get all activity from database and display to screen.
function listVolunteer() {
    //Checking the device, which is not support database.
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    //clear out any content in the #lsActivity element
    $('#lsActivity').html('');
    //This section use to get all value from Volunteer table in database.
    //Appending to #lsActivity element.
    iVDb.transaction(function (transaction) {
        transaction.executeSql('SELECT rowid, * FROM Volunteer;', [],
            function (transaction, result) {
                if (result !== null && result.rows !== null) {
                    for (var i = 0; i < result.rows.length; i++) {
                        var row = result.rows.item(i);
                        $('#lsActivity').append(
                            '<hr>Activity: ' + row.activity +
                            '<br/>Location: ' + row.location +
                            '<br/>Date: ' + row.a_date +
                            '<br/>Time: ' + row.a_time +
                            '<br/>Volunteer: ' + row.name +
                            '<br><button class="btn btn-danger float-right" onclick="deleteVolunteer(' + row.rowid + ')">Delete</button>' +
                            '<br>');
                    }
                }
            }, errorHandler);
    }, errorHandler, nullHandler);
    return;
}
//this is called when get all activity from database and append to selected list.
function loadVolunteer() {
    //Checking the device, which is not support database.
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    //clear out any content in the #slActivity element
    $('#slActivity').html('');
    //This section use to get rowid and activity name from Volunteer table in database.
    //Appending to #slActivity element.
    iVDb.transaction(function (transaction) {
        transaction.executeSql('SELECT rowid, * FROM Volunteer;', [],
            function (transaction, result) {
                if (result !== null && result.rows !== null) {
                    for (var i = 0; i < result.rows.length; i++) {
                        var row = result.rows.item(i);
                        $('#slActivity').append('<option value="' + row.rowid + '">' + row.activity + '</option>');
                    }
                }
            }, errorHandler);
    }, errorHandler, nullHandler);
    return;
}
//this is called when get activity information from database and display to screen.
function searchVolunteer() {
    //get value from selected list activity form.
    var activity = document.getElementById('slActivity');
    var activity_id = activity.options[activity.selectedIndex].value;
    //Checking the device, which is not support database.
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    //clear out any content in the #rsActivity element
    $('#rsActivity').html('');
    //This section use to get all value by rowid from Volunteer table in database.
    //Appending to #rsActivity element.
    iVDb.transaction(function (transaction) {
        transaction.executeSql('SELECT * FROM Volunteer WHERE rowid=?;', [activity_id],
            function (transaction, result) {
                if (result !== null && result.rows !== null) {
                    for (var i = 0; i < result.rows.length; i++) {
                        var row = result.rows.item(i);
                        $('#rsActivity').append(
                            '<hr>' +
                            'RESULT ' +
                            '<hr>' +
                            'Activity: ' + row.activity +
                            '<br/> Location: ' + row.location +
                            '<br/>Date: ' + row.a_date +
                            '<br/>Time: ' + row.a_time +
                            '<br/>Volunteer: ' + row.name);
                    }
                }
            }, errorHandler);
    }, errorHandler, nullHandler);
    return;
}
//this is called when deleted an activity information from database and display to screen.
function deleteVolunteer(rowid) {
    //Checking the device, which is not support database.
    if (!window.openDatabase) {
        alert('Databases are not supported in this browser.');
        return;
    }
    //show confirm dialog when user want to delete an activity.
    var r = confirm('Are you sure?');
    // when user accepted.
    if (r == true) {
        iVDb.transaction(function (transaction) {
            transaction.executeSql('DELETE FROM Volunteer WHERE rowid = ?', [rowid],
                nullHandler, errorHandler);
        })
    }
    //call show_view() method to reload all activity information.
    show_view();
    return true;
}
