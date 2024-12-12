
let modifiedFormdata;
let originalFormData;
let id = '';
let method = '';

function preserveFormData() {
	return async ({ request }) => {
		const formData = await request.formData();
		originalFormData = Object.fromEntries(formData.entries());
		id = formData.get('uuid') ? formData.get('uuid') : '';
		method = formData.get('method') ? formData.get('method') : '';
		formData.delete('uuid');
		formData.delete('method');
		modifiedFormdata = Object.fromEntries(formData.entries());
		return {
			data: originalFormData
		};
	};
}

export const actions = {
	review: preserveFormData(),
	final: async () => {
		const data = modifiedFormdata;
		const dataToSend = new FormData();
		dataToSend.set('video', JSON.stringify(data));
		if (method === 'POST') {
			const response = await fetch(
				// 'http://reap-dev-admin-service.ap-south-1.elasticbeanstalk.com/reap/api/v1/videos',
				{
					method: 'POST',
					body: dataToSend
				}
			);
			if (!response.ok || !response.status == 201) {
				return { error: 'Failed to submit form', data: originalFormData };
			}
		}

		if (method === 'PUT') {
			const response = await fetch(
				// `http://reap-dev-admin-service.ap-south-1.elasticbeanstalk.com/reap/api/v1/courses/${id}`,
				{
					method: 'PUT',
					body: dataToSend
				}
			);
			if (!response.ok || !response.status == 200) {
				return { error: 'Failed to submit form', data: originalFormData };
			}
		}

		return { success: true, data: data };
	}
};
