export type SocialPlatform = 'facebook' | 'instagram';

export type SendObject = {
	socialtype: SocialPlatform;
	userUrl: string;
	message: string;
};
