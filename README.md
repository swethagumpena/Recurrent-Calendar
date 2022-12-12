# Recurrent Calendar

(As part of CS 422 - User Interface design and Programming)

Controlled experiment comparing two different implementations of the same basic user interface (A/B Testing)

### Modified interface - https://swethagumpena.github.io/Recurrent-Calendar/

Given interface - http://web.mit.edu/6.813/www/sp17/assignments/as1-implementation/exampleC

### Key features added:

1. Improved the affordance of the ‘Create Event’ button by giving an appropriate color to capture the user's attention. This aids learnability
2. Added a ‘Reset’ button and styled it in Red to give the impression of deletion/reset. This Reset button clears all the values of the input fields
3. Added placeholders ‘YYYY/MM/DD HH:MM’ to educate the user on the format of date entry in the input fields
4. The fields ‘New Event’, ‘Start date’, and ‘End date’ is mandatory to create an event. This is conveyed using a red asterisk ( \* ) to imply these fields are required.
5. The fields that have an error are highlighted in Red to capture the attention of the user to the places which need to be updated  
   Once the user selects a start date, they would be allowed to select an end date that is only after the start date.
6. Added a “Start New Event” button (as shown in Fig 1) to start the session of creating a
   new event. All the fields are disabled at first. On clicking this button, the fields are enabled and the user can create a new event. This is mainly done to log the exact time when the user has started the process of event creation
7. On clicking the “Start New Event” button, all the
8. Once an event is created, in order to create the next event, by just clicking the “Start New Event” button all the input fields are reset

### Experimental Hypothesis

1. Due to the addition of the ‘Reset’ button, after the user creates an event they need not manually delete the entries of the input fields as these account for keydown events and takes considerable time. By clicking a single button the inputs are cleared out for the user to create a new event which accounts for only one mousedown event
2. By highlighting the corresponding fields which have an error either due to missing values or incorrect types, we can quickly capture the attention of the user to the respective fields and efficiently correct the mistakes
3. During the selection of the end date, by disabling the dates prior to the start date we ensure safety by preventing the user from making mistakes of choosing a past date

### New logged events

1. errorStart - to record when the event has been started (Triggered when the user clicks “Create New Event” button)
2. errorEnd - to record when the event has ended i.e., when the user has successfully created an event (when the “Create Event” button is clicked with valid inputs)
3. errorFeedbackShown - to record the event when an error has occurred and an error message is shown up in the UI
   It has the format: { "error": true, "message": “error message” }
4. errorFeedbackRemoved - to record the event when an error message has been removed and there was a success in event creation. It has the format: { "error": false }
