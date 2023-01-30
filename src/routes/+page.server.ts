import type { Actions } from './$types';
import { getSasUrl } from './storage-demo';

export const actions = {
	getSasUrl: async ({ request }) => {
		try {
			const fileName = (await request.formData()).get('fileName') as string;
			const sasUrl = await getSasUrl("dummyuser_id", fileName);
			return createData({ sasUrl: sasUrl });
		} catch (error: any) {
			console.error(error);
			return createData({ sasMessage: 'error:' + error.message });
		}
	}
} satisfies Actions;

type Args = {
	message?: string;
	sasUrl?: string;
	sasMessage?: string;
};
const createData = (args: Args) => {
	return {
		message: args.message,
		sasUrl: args.sasUrl,
		sasMessage: args.sasMessage
	};
};