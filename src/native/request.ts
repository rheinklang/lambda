import { RequestOptions, request } from 'https';

export const fetch = <T>(opts: RequestOptions, data?: string) => {
	return new Promise<T>((resolve, reject) => {
		let responseBody: string;
		const call = request(opts, (res) => {
			res.setEncoding('utf8');
			res.on('data', (chunk) => (responseBody += chunk));
			res.on('end', () => resolve(JSON.parse(responseBody)));
		});

		call.on('error', (err) => reject(err));

		if (data) {
			call.write(data);
			call.end();
		}
	});
};
