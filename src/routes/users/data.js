export const narAdminActionConfig = [
    {
        actionName: 'view',
        actionIconName: 'visibility',
        goto: '/users/details',
        modal: false
    },
    {
        actionName: 'edit',
        actionIconName: 'edit',
        goto: '/users/edit',
        dispatch: false
    },
    {
        actionName: 'delete',
        actionIconName: 'delete',
        goto: '',
        modal: true
    }
];
export const narAdminTableHeaderDisplay = [{ key: 'name', name: 'Name' }, {key: "role", name: "Designation"}];

export const stateAdminActionConfig = [];
export const stateAdminTableHeaderDisplay = [];

export const rsetiAdminActionConfig = [];
export const rsetiAdminTableHeaderDisplay = [];

export const narTestingData = {
	totalPages: 1,
	totalElements: 1,
	size: 20,
	content: [
		{
			id: 1,
			state: 'tvm',
			createdOn: '2024-07-09T06:51:57.839+00:00',
			status: 1,
			lastUpdatedOn: '2024-07-09T06:51:57.839+00:00',
			user: {
				id: 2,
				uuid: '6c857265-a436-4488-8829-0c5b1bfdcd87',
				email: 'jishnusivan7@gmail.com',
				name: 'Vishnu',
				photoValue: null,
				contactNo: '9048967281',
				permanentAddress: 'Test',
				currentAddress: 'Test',
				isPermanentAndCurrentAddressSame: true,
				status: 'ACTIVE',
				role: 'SU',
				designation: 'CGO',
				createdOn: '2024-07-09T06:51:57.839+00:00',
				lastUpdatedOn: '2024-07-09T06:51:57.839+00:00'
			}
		}
	],
	number: 0,
	sort: { empty: true, sorted: false, unsorted: true },
	first: true,
	last: true,
	numberOfElements: 1,
	pageable: {
		pageNumber: 0,
		pageSize: 20,
		sort: { empty: true, sorted: false, unsorted: true },
		offset: 0,
		paged: true,
		unpaged: false
	},
	empty: false
};

export const stateTestingData = {
	totalPages: 1,
	totalElements: 1,
	size: 20,
	content: [
		{
			id: 1,
			state: 'tvm',
			createdOn: '2024-07-09T06:51:57.839+00:00',
			status: 1,
			lastUpdatedOn: '2024-07-09T06:51:57.839+00:00',
			user: {
				id: 2,
				uuid: '6c857265-a436-4488-8829-0c5b1bfdcd87',
				email: 'jishnusivan7@gmail.com',
				name: 'Kishnu',
				photoValue: null,
				contactNo: '9048967281',
				permanentAddress: 'Test',
				currentAddress: 'Test',
				isPermanentAndCurrentAddressSame: true,
				status: 'ACTIVE',
				role: 'SU',
				designation: 'CEO',
				createdOn: '2024-07-09T06:51:57.839+00:00',
				lastUpdatedOn: '2024-07-09T06:51:57.839+00:00'
			}
		}
	],
	number: 0,
	sort: { empty: true, sorted: false, unsorted: true },
	first: true,
	last: true,
	numberOfElements: 1,
	pageable: {
		pageNumber: 0,
		pageSize: 20,
		sort: { empty: true, sorted: false, unsorted: true },
		offset: 0,
		paged: true,
		unpaged: false
	},
	empty: false
};

export let rsetiTestingData = {
	totalPages: 1,
	totalElements: 1,
	size: 20,
	content: [
		{
			id: 1,
			state: 'tvm',
			createdOn: '2024-07-09T06:51:57.839+00:00',
			status: 1,
			lastUpdatedOn: '2024-07-09T06:51:57.839+00:00',
			user: {
				id: 2,
				uuid: '6c857265-a436-4488-8829-0c5b1bfdcd87',
				email: 'jishnusivan7@gmail.com',
				name: 'Jishnu',
				photoValue: null,
				contactNo: '9048967281',
				permanentAddress: 'Test',
				currentAddress: 'Test',
				isPermanentAndCurrentAddressSame: true,
				status: 'ACTIVE',
				role: 'SU',
				designation: 'CTO',
				createdOn: '2024-07-09T06:51:57.839+00:00',
				lastUpdatedOn: '2024-07-09T06:51:57.839+00:00'
			}
		}
	],
	number: 0,
	sort: { empty: true, sorted: false, unsorted: true },
	first: true,
	last: true,
	numberOfElements: 1,
	pageable: {
		pageNumber: 0,
		pageSize: 20,
		sort: { empty: true, sorted: false, unsorted: true },
		offset: 0,
		paged: true,
		unpaged: false
	},
	empty: false
};
