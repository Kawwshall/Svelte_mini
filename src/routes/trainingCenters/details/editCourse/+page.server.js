async function saveCourseData({ request, fetch }) {
	try {
		const data = await request.formData();
		const formData = Object.fromEntries(data.entries());

		// Parse `courseSubmissionData` from form data
		const courseSubmissionData = JSON.parse(formData.courseSubmissionData);

		// Construct the API URL
		const apiUrl = `/apis/trainingCenters/courses/${formData.rsetiUUID}`;

		// Make the API call
		const response = await fetch(apiUrl, {
			method: 'PUT',
			body: JSON.stringify(courseSubmissionData),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		// Check the response for success or handle errors
		if (!response.ok) {
			throw new Error(`Failed to update course data. Status: ${response.status}`);
		}

		return {
			formSaved: true,
			message: 'Form saved successfully'
		};
	} catch (error) {
		console.error('Error in form action for Course: ', error.message);
		return {
			formSaved: false,
			message: `Failed to save form: ${error.message}`
		};
	}
}

export const actions = {
	final: saveCourseData
};
