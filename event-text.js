// For simplicity this calendar has no backend.
// An event is displayed as a sentence below the event creation dialogue
// with the details of the event in readable English.


/////////////////////////////////////////////////////////////////////////////
// New Event Creation
/////////////////////////////////////////////////////////////////////////////

$(function () {
	$('#create-event-button').click(function () {
		if (checkInputs()) {
			writeEventToScreen(getEventText());
			$(".event-form").attr('disabled', true);
			$("#start-event-button").attr('disabled', false);
			$('#create-event-button').trigger('log', ['eventEnd', { 'what': 'Event created' }]);
		}
	});

	$('#start-event-button').click(function () {
		$(".event-form").attr('disabled', false);
		$("#start-event-button").attr('disabled', true);
		$('#start-event-button').trigger('log', ['eventStart', { 'what': 'New event started' }]);
	});
});

// End time must come after start time
function isValidEndTime() {
	var startTime = $('#event-start-date').datetimepicker('getValue');
	var endTime = $('#event-end-date').datetimepicker('getValue');
	return !(endTime < startTime);
}

var missingValuesErrorMessage

function doInputsHaveValue() {
	missingValuesErrorMessage = ''
	var elementsToCheck = ['#event-name', '#event-start-date', '#event-end-date', '#all-day-event-date', '#recurrent-event-end-date']
	elementsToCheck.forEach((element) => {
		if ($(element).is(":visible") && !$(element).val().length) {
			$(element).css("border", "red 2px solid");
			missingValuesErrorMessage = missingValuesErrorMessage + element.replace(/#|-/gi, ' ') + ','
		}
	})
	return missingValuesErrorMessage.length
}

function checkInputs() {
	if (doInputsHaveValue()) {
		const constructedErrorMessage = `Please enter the ${missingValuesErrorMessage.replace(/,*$/, '')}`
		$('#new-event-text').text(constructedErrorMessage);
		$('#new-event-text').trigger('log', ['errorFeedbackShown', { 'error': true, 'message': constructedErrorMessage }]);
		return false
	}

	if (!isValidEndTime()) {
		writeEventToScreen('End time must come after start time.');
		$('#event-end-date').css("border", "red 2px solid");
		$('#new-event-text').trigger('log', ['errorFeedbackShown', { 'error': true, 'message': 'End time must come after start time.' }]);
		return false;
	} else {
		$('#event-end-date').css("border", "");
	}

	var frequency = $('#' + $('#recurrent-event-time-selector').val() + '-recurrent-freq').val();
	if (!$.isNumeric(frequency)) {
		writeEventToScreen('Frequency must be a numeric value.');
		$("[id*='-recurrent-freq']").css("border", "red 2px solid");
		$('#new-event-text').trigger('log', ['errorFeedbackShown', { 'error': true, 'message': 'Frequency must be a numeric value.' }]);
		return false;
	} else {
		$("[id*='-recurrent-freq']").css("border", "");
	}

	if ($('#new-event-text').text().includes('Please enter the')) {
		$('#new-event-text').trigger('log', ['errorFeedbackRemoved', { 'error': false }]);
	}
	return true;
}

// Functions for building the event string
function getWeeklyRepeatingDays() {
	var days = [];
	var weekdayIds = ['#weekday-sun', '#weekday-mon', '#weekday-tue', '#weekday-wed', '#weekday-thu', '#weekday-fri',
		'#weekday-sat'];
	var weekdays = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	for (i = 0; i < weekdayIds.length; i++) {
		if ($(weekdayIds[i]).is(':checked')) {
			days.push(weekdays[i]);
		}
	}
	return days;
}
function getMonthlyRepeatingDays() {
	var days = [];
	var monthdayIds = ['#month-1', '#month-2', '#month-3', '#month-4', '#month-5', '#month-6', '#month-7', '#month-8',
		'#month-9', '#month-10', '#month-11', '#month-12', '#month-13', '#month-14', '#month-15', '#month-16',
		'#month-17', '#month-18', '#month-19', '#month-20', '#month-21', '#month-22', '#month-23', '#month-24',
		'#month-25', '#month-26', '#month-27', '#month-28', '#month-29', '#month-30', '#month-31'];
	for (i = 0; i < monthdayIds.length; i++) {
		if ($(monthdayIds[i]).is(':checked')) {
			days.push(i + 1);
		}
	}
	return days;
}
function getYearlyRepeatingMonths() {
	var months = [];
	var monthIds = ['#year-jan', '#year-feb', '#year-mar', '#year-apr', '#year-may', '#year-jun', '#year-jul',
		'#year-aug', '#year-sept', '#year-oct', '#year-nov', '#year-dec'];
	var monthsNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sept', 'Oct', 'Nov', 'Dec'];
	for (i = 0; i < monthIds.length; i++) {
		if ($(monthIds[i]).is(':checked')) {
			months.push(monthsNames[i]);
		}
	}
	return months;
}

function getWeeklyRepeatingString(arr) {
	var eventString = 'on every ';
	for (i = 0; i < arr.length - 1; i++) {
		eventString += arr[i] + ', ';
	}
	if (arr.length > 1) {
		eventString += 'and ';
	}
	eventString += arr[arr.length - 1] + ' of the week ';
	return eventString;
}
function getMonthlyRepeatingString(arr) {
	var eventString = 'on the ';
	for (i = 0; i < arr.length - 1; i++) {
		eventString += arr[i] + ', ';
	}
	if (arr.length > 1) {
		eventString += 'and ';
	}
	eventString += arr[arr.length - 1] + ' of the month ';
	return eventString;
}
function getYearlyRepeatingString(arr) {
	var eventString = 'in ';
	for (i = 0; i < arr.length - 1; i++) {
		eventString += arr[i] + ', ';
	}
	if (arr.length > 1) {
		eventString += 'and ';
	}
	eventString += arr[arr.length - 1] + ' on the corresponding day of the month(s) ';
	return eventString;
}

function getEventText() {
	var eventName = $('#event-name').val();
	var eventLocation = $('#event-location').val();

	var eventString = `Event created: ${eventName}${eventLocation.length ? ` at ${eventLocation}` : ''}, '`;

	var allDayEvent = $('#all-day-event-checkbox').is(':checked');
	if (allDayEvent) {
		var eventDate = $('#all-day-event-date').datetimepicker('getValue');
		eventString += 'an all day event on ' + eventDate;
	} else {
		var startTime = $('#event-start-date').datetimepicker('getValue');
		var endTime = $('#event-end-date').datetimepicker('getValue');
		eventString += 'starting at ' + startTime + ' and ending at ' + endTime;
	}

	var repeatOption = $('#recurrent-event-type-selector').val();
	if (repeatOption == 'none') {
		eventString += '.';
		return eventString;
	} else if (repeatOption == 'day') {
		eventString += ', repeating every day ';
	} else if (repeatOption == 'week') {
		eventString += ', repeating every week ';
	} else if (repeatOption == 'month') {
		eventString += ', repeating every month ';
	} else if (repeatOption == 'year') {
		eventString += ', repeating every year ';
	} else { // custom
		var frequencyOption = $('#recurrent-event-time-selector').val();
		var frequency = 1;
		var repeatingUnits = [];
		if (frequencyOption == 'daily') {
			frequency = $('#daily-recurrent-freq').val();
			eventString += ', ' + 'repeating every ' + frequency + ' day(s) ';
		} else if (frequencyOption == 'weekly') {
			frequency = $('#weekly-recurrent-freq').val();
			repeatingUnits = getWeeklyRepeatingDays();
			eventString += ', ' + 'repeating every ' + frequency + ' week(s) ' + getWeeklyRepeatingString(repeatingUnits);
		} else if (frequencyOption == 'monthly') {
			frequency = $('#monthly-recurrent-freq').val();
			repeatingUnits = getMonthlyRepeatingDays();
			eventString += ', ' + 'repeating every ' + frequency + ' month(s) ' + getMonthlyRepeatingString(repeatingUnits);
		} else { // yearly
			frequency = $('#yearly-recurrent-freq').val();
			repeatingUnits = getYearlyRepeatingMonths();
			eventString += ', ' + 'repeating every ' + frequency + ' year(s) ' + getYearlyRepeatingString(repeatingUnits);
		}
	}
	var endDate = $('#recurrent-event-end-date').datetimepicker('getValue');
	eventString += 'until ' + endDate + '.';
	return eventString;
}

function writeEventToScreen(eventString) {
	$('#new-event-text').text(eventString);
}