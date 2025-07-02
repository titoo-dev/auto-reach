import type { SendObject } from "@/lib/types";
import { useAppStore, useFormData, useIsFormValid, useUrlError } from "@/store/app-store";
import { useTransition } from "react";
import { PlatformSelector } from "./fields/platform-selector";
import { ProfileUrlField } from "./fields/profile-url-field";
import { MessageTemplateField } from "./fields/message-template-field";
import { Button } from "../ui/button";

type AddSendObjectFormProps = {
	onCancel: () => void;
};

export const AddSendObjectForm: React.FC<AddSendObjectFormProps> = ({
	onCancel,
}) => {
	const [isPending, startTransition] = useTransition();

	// Use Zustand store instead of local state
	const formData = useFormData();
	const urlError = useUrlError();
	const isFormValid = useIsFormValid();
	const {
		updateFormField,
		setPlatform,
		validateUrl,
		setUrlError,
		resetForm,
	} = useAppStore.getState();

	const handleInputChange = (
		field: keyof SendObject,
		value: string
	): void => {
		updateFormField(field, value);
	};

	const handlePlatformChange = (platform: 'facebook' | 'instagram'): void => {
		setPlatform(platform);
	};

	const handleUrlBlur = (): void => {
		const error: string = validateUrl(
			formData.socialtype,
			formData.userUrl
		);
		setUrlError(error);
	};

	const handleSubmit = (e: React.FormEvent<HTMLFormElement>): void => {
		e.preventDefault();

		// Validate form using store validation
		const urlValidationError: string = validateUrl(
			formData.socialtype,
			formData.userUrl
		);
		setUrlError(urlValidationError);

		if (urlValidationError || !formData.message.trim()) {
			return;
		}

		startTransition(() => {
			// Create new send object from form data
			const newSendObject: SendObject = {
				socialtype: formData.socialtype,
				userUrl: formData.userUrl.trim(),
				message: formData.message.trim(),
			};

			// Add to store using addSendObject action
			const { addSendObject } = useAppStore.getState();
			addSendObject(newSendObject);

			// Console log submitted information
			console.log('Added Send Object:', newSendObject);

			// Reset form and close
			resetForm();
			onCancel();
		});
	};

	const handleCancel = (): void => {
		resetForm();
		onCancel();
	};

	return (
		<form onSubmit={handleSubmit} className="space-y-6 mt-4">
			<PlatformSelector
				value={formData.socialtype}
				onValueChange={handlePlatformChange}
			/>

			<ProfileUrlField
				socialType={formData.socialtype}
				value={formData.userUrl}
				error={urlError}
				onChange={(value: string) =>
					handleInputChange('userUrl', value)
				}
				onBlur={handleUrlBlur}
			/>

			<MessageTemplateField
				value={formData.message}
				onChange={(value: string) =>
					handleInputChange('message', value)
				}
			/>

			<div className="flex justify-end gap-3 pt-4">
				<Button
					type="button"
					variant="outline"
					onClick={handleCancel}
					disabled={isPending}
				>
					Cancel
				</Button>
				<Button
					type="submit"
					disabled={isPending || !isFormValid}
					className="min-w-[80px]"
				>
					{isPending ? 'Adding...' : 'Add'}
				</Button>
			</div>
		</form>
	);
};
