import { Elysia } from 'elysia'
import jwt from 'jsonwebtoken'

export const authPlugin = new Elysia({ name : 'auth' })
	.derive({ as: 'global' }, ({ headers, set }) => {
		const token = headers.authorization?.replace('Bearer ', '')

		if (!token) {
			set.status = 401
			throw new Error('Missing token')
		}
		try {
			const payload = jwt.verify(token, process.env.JWT_SECRET!)
			return { user : payload }
		} catch (e) {
			set.status = 401
			throw new Error('Invalid token')
		}
	});
