import { create } from 'zustand';

// import type {CommandResponse} from '@discord/embedded-app-sdk';

// export type TAuthenticatedContext = CommandResponse<'authenticate'> & {guildMember: IGuildsMembersRead | null};

// export interface IGuildsMembersRead {
//   roles: string[];
//   nick: string | null;
//   avatar: string | null;
//   premium_since: string | null;
//   joined_at: string;
//   is_pending: boolean;
//   pending: boolean;
//   communication_disabled_until: string | null;
//   user: {
//     id: string;
//     username: string;
//     avatar: string | null;
//     discriminator: string;
//     public_flags: number;
//   };
//   mute: boolean;
//   deaf: boolean;
// }

export const authStore = create(() => ({
	user: undefined, // as unknown as TAuthenticatedContext['user'],
	access_token: '',
	scopes: [],
	expires: '',
	application: {
		rpc_origins: undefined,
		id: '',
		name: '',
		icon: null,
		description: '',
	},
	guildMember: null,
}));