import { PrismaConnection } from '../utils/PrismaConnection'
import bcrypt from 'bcrypt'
import _ from 'lodash'

export class Owner{
	private owner_id?: number | undefined
	private email: string | undefined
	private name: string | undefined
	private password: string | undefined

	public getName(): string | undefined {
		return this.name
	}
	public setName(v: string) {
		this.name = v
	}
	public getId(): number | undefined {
		return this.owner_id
	}
	public setId(v: number) {
		this.owner_id = v
	}
	public getEmail(): string | undefined {
		return this.email
	}
	public setEmail(v: string) {
		this.email = v
	}

	constructor(ownerInformation: any) {
		const name: string = ownerInformation.name
		const password: string = ownerInformation.password
		const owner_id: string = ownerInformation.id
		const email: string = ownerInformation.email

		if (name) {
			this.name = name
		}
		if (password) {
			this.password = password
		}
		if (owner_id) {
			this.owner_id = parseInt(owner_id)
		}
		if (email) {
			this.email = email
		}
	}

	public async getOwner() {
		try {
			if (!this.owner_id) {
				throw new Error('Cannot get user without ID')
			}
			const owner = await PrismaConnection.prisma.owners.findUniqueOrThrow({
				where: { owner_id: this.owner_id },
			})
			const ownerWithoutPassword = _.omit(owner, 'password')
			return ownerWithoutPassword
		} catch (error) {
			console.error('Error while getting the owner: ', error)
			throw error
		}
	}

	public async getOwners() {
		try {
			const owners = await PrismaConnection.prisma.owners.findMany()

			const ownersWithoutPassword = owners.map((owner: any) => {
				_.omit(owner, 'password')
			})
			return ownersWithoutPassword
		} catch (error) {
			console.error('Error while getting the owners: ', error)
			throw error
		}
	}

	public async saveOwner() {
		try {
			if (this.password) {
				const hashedPassword: string = await bcrypt.hash(this.password, 10);
				this.password = hashedPassword;
			}
			const owner = await PrismaConnection.prisma.owners.create({
				data: {
					name: this.name!,
					password: this.password!,
					email: this.email!
				},
			})
			const ownerWithoutPassword = _.omit(owner, 'password')
			return ownerWithoutPassword

		} catch (error) {
			console.log('Error while adding new owner: ', error)
			throw error
		}
	}

	public async updateOwner() {
		try {
			if (!this.owner_id) {
				throw new Error('Cannot update owner without ID')
			}
			if (this.password) {
				const hashedPassword: string = await bcrypt.hash(this.password, 10);
				this.password = hashedPassword;
			}
			const owner = await PrismaConnection.prisma.owners.update({
				where: { owner_id: this.owner_id },
				data: {
					name: this.name,
					password: this.password,
					email: this.email
				},
			})
			const ownerWithoutPassword = _.omit(owner, 'password')
			return ownerWithoutPassword

		} catch (error) {
			console.error('Error while updating the owner: ', error)
			throw error
		}
	}

	public async deleteOwner() {
		try {
			if (!this.owner_id) {
				throw new Error('Cannot delete owner without ID')
			}
			const owner = await PrismaConnection.prisma.owners.delete({
				where: { owner_id: this.owner_id },
			})
			const ownerWithoutPassword = _.omit(owner, 'password')
			return ownerWithoutPassword

		} catch (error) {
			console.error('Error while deleting the owner:', error)
			throw error
		}
	}

	public async findOwnerByEmail() {
		try {
			const owner = await PrismaConnection.prisma.owners.findUnique({
				where: { email: this.email },
			});
			return owner

		} catch (error) {
			console.error('Error while finding the owner by email:', error);
			throw error;
		}
	}
}
