async function saveCourseData({ request, fetch }) {
	try {
		// Extract form data
		const data = await request.formData();

		const formData = Object.fromEntries(data.entries());

		// Parse the `postData` field as JSON
		const body = JSON.parse(formData.postData);

		// Send POST request
		const response = await fetch(`/apis/trainingCenters/courses/${formData.rsetiUUID}`, {
			method: 'POST',
			body: JSON.stringify(body),
			headers: {
				'Content-Type': 'application/json'
			}
		});

		// Check for a successful response
		if (!response.ok) {
			throw new Error(`Failed to save course data: ${response.statusText}`);
		}

		// Return success status
		return {
			formSaved: true,
			message: 'Form saved successfully'
		};
	} catch (error) {
		console.error('Error in form action for Course:', error.message);
		return {
			formSaved: false,
			message: `Error: ${error.message}`
		};
	}
}

export const actions = {
	final: saveCourseData
};
