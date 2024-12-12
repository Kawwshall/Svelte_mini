import { json } from '@sveltejs/kit';

export async function GET({ params, request, cookies }) {
	const id = params.id;
	const authToken = cookies.get('authToken');
	try {
		const options = {
			method: 'GET',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${authToken}`
			}
		};
		const res = await fetch(
			`http://read-admin-api-dev.ap-south-1.elasticbeanstalk.com/apis/v1/rsetis/${id}/courses`,
			options
		);
		if (!res.ok || res.status != 200) {
			throw new Error('Failed to get courses data');
		}
		const data = await res.json();

		if (data?.length === 0 || Object.keys(data)?.length === 0) {
			throw new Error('Data not found');
		}
		return json(data);
	} catch (error) {
		return json({ error: error.message });
	}
}

export async function POST({ request, cookies, params }) {
	const authToken = cookies.get('authToken');
	const id = params.id;
	try {
		const req = await request.json();

		const res = await fetch(
			`http://read-admin-api-dev.ap-south-1.elasticbeanstalk.com/apis/v1/rsetis/${id}/courses`,
			{
				method: 'POST',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${authToken}`
				},
				body: JSON.stringify(req)
			}
		);

		if (!res.ok) {
			throw new Error('Failed to add course');
		}

		const responseData = await res.json();
		return json(responseData);
	} catch (error) {
		console.log('Failed to post course data: ', error.message);
	}
}

export async function PUT({ request, cookies, params }) {
	const authToken = cookies.get('authToken');
	const id = params.id;
	try {
		const req = await request.json();

		const res = await fetch(
			`http://read-admin-api-dev.ap-south-1.elasticbeanstalk.com/apis/v1/rsetis/${id}/courses`,
			{
				method: 'PUT',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${authToken}`
				},
				body: JSON.stringify(req)
			}
		);

		if (!res.ok) {
			throw new Error('Failed to edit course');
		}

		const responseData = await res.json();
		return json(responseData);
	} catch (error) {
		console.log('Failed to edit course data: ', error.message);
	}
}
export async function DELETE({ cookies, params, url }) {
	const courseUUID = JSON.parse(url.searchParams?.get('data'));
	const authToken = cookies.get('authToken');
	const id = params.id;
	try {
		const res = await fetch(
			`http://read-admin-api-dev.ap-south-1.elasticbeanstalk.com/apis/v1/rsetis/${id}/courses/${courseUUID.uuid}`,
			{
				method: 'DELETE',
				headers: {
					'Content-Type': 'application/json',
					Authorization: `Bearer ${authToken}`
				}
			}
		);
		if (!res.ok) {
			throw new Error('Failed to delete course');
		}

		return res;
	} catch (error) {
		console.log('Failed to delete course: ', error.message);
	}
}
