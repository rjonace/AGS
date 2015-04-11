Meteor.subscribe('coursesList');
Meteor.subscribe('availableCourses');
Meteor.subscribe('currentUserInfo');
Meteor.subscribe('userData');
Meteor.subscribe('allAssignments');
Meteor.subscribe('allAssignment');
Meteor.subscribe('submissionData');

Tracker.autorun(function() {
	if(Session.get('manGradedRow')){
	    var curRow = Session.get('manGradedRow');
	    console.log(curRow);
	    $('#viewFilesModal').modal({ onVisible: function(){
            $('#viewFilesModal').modal({
                onDeny : function() {
                    console.log('Deny');
                    Session.set('manGradedRow', null);
                },
                onApprove : function() {
                    curRow.pointsEarned = Number($('#pointsEarnedInput').val());
                    curRow.comments = $('#commentsInput').val();
                    var updatedFeedback = submission.feedbackObj;
                    updatedFeedback["sections"][tableIndex]["rows"][rowIndex] = curRow;
                    Meteor.call('updateFeedbackObj', submission.id_Student, Session.get('currentAssignment')._id, submission.subNumber, updatedFeedback, 
                        function(error, result) {
                            if (!error)
                                Meteor.call('resetSubmissionSession', submission.id_Student, Session.get('currentAssignment')._id, submission,
                                    function(error,result){
                                        if(!error){
                                            Session.set('currentSubmission',result);
                                        }
                                        else console.log(error);
                                    }
                                );
                            else
                                console.log(error);
                        }
                    );
                    Session.set('manGradedRow', null);
                }
            });
	    }});

		console.log('if');
	} else {
	    $('#viewFilesModal').modal('hide');
		console.log('else');
	}
}, {onError: function(error){ console.log(error); }})


