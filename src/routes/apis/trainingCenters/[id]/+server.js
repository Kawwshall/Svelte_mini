import { json } from '@sveltejs/kit';

export async function PUT({ params, request, cookies }) {
	const uuid = params.id;
	const authToken = cookies.get('authToken');

	try {
		const req = await request.json();

		const parsedData = JSON.parse(req.data);

		const res = await fetch(
			`http://read-admin-api-dev.ap-south-1.elasticbeanstalk.com/apis/v1/rsetis/${uuid}`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${authToken}`
				},
				body: JSON.stringify(parsedData)
			}
		);

		console.log('res in server js', res.status, '----------------res--------------', res);

		if (!res.ok) {
			throw new Error('Failed to add edit rseti data');
		}
		const responseData = await res.json();

		return json(responseData);
	} catch (error) {
		console.log('Failed to edit rseti data ', error.message);
	}
}

export async function DELETE({ params, cookies }) {
	const uuid = params.id;
	const authToken = cookies.get('authToken');
	try {
		const res = await fetch(
			`http://read-admin-api-dev.ap-south-1.elasticbeanstalk.com/apis/v1/rsetis/${uuid}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${authToken}`
				}
			}
		);
		if (!res.ok) {
			throw new Error('Failed to delete rseti data');
		}
		// const responseData = await res.json();
		return res;
	} catch (error) {
		console.log('Failed to delete rseti data ', error.message);
	}
}
