import { RequestOptions, request } from 'https';

export enum FetchMethod {
	POST = 'POST',
	GET = 'GET',
	PUT = 'PUT',
	DELETE = 'DELETE'
}

export const fetch = <T extends object>(opts: RequestOptions, data?: string) => {
	return new Promise<T>((resolve, reject) => {
		const call = request(opts, (res) => {
			let responseBody: string;
			res.setEncoding('utf8');
			res.on('data', (chunk) => (responseBody += chunk));
			res.on('end', () => {
				console.log(`Request info: ${call.method} ${opts.host} ${call.path}`);
				console.log(`Response ${res.statusCode} body ${responseBody}`);

				if (res.statusCode > 300) {
					return resolve(res as T)
				}

				try {
					resolve(JSON.parse(responseBody))
				} catch (err) {
					resolve({
						error: err
					} as T);
				}

			});
		});

		call.on('error', (err) => reject(err));

		if (data) {
			call.write(data);
			call.end();
		}
	});
};
