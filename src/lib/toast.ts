import { writable } from "svelte/store";
import ErrorIcon from "./icons/ErrorIcon.svelte";
import InfoIcon from "./icons/InfoIcon.svelte";
import LoadingIcon from "./icons/LoadingIcon.svelte";
import SuccessIcon from "./icons/SuccessIcon.svelte";
import WarningIcon from "./icons/WarningIcon.svelte";
import type {
	MergedToastOptions,
	Toast,
	ToastOptions,
	ToastType,
} from "./types";

export const toasts = writable<Array<Toast>>([]);

const defaultOptions: {
	position: MergedToastOptions["position"];
	duration: MergedToastOptions["duration"];
	icons: { [type in ToastType]?: MergedToastOptions["icon"] };
	dismissOnClick: boolean;
} = {
	position: "bottom-end",
	duration: 5000,
	icons: {
		default: undefined,
		info: InfoIcon,
		success: SuccessIcon,
		warning: WarningIcon,
		error: ErrorIcon,
		loading: LoadingIcon,
	},
	dismissOnClick: true,
};

let toastId = 0;

function mergeToastOptions(
	type: ToastType,
	options?: ToastOptions,
): MergedToastOptions {
	return {
		position: defaultOptions.position,
		duration: defaultOptions.duration,
		icon: defaultOptions.icons[type],
		dismissOnClick: defaultOptions.dismissOnClick,
		...options,
	};
}

function removeToastAfterDelay(id: number, delay = 5000) {
	if (delay > 0)
		setTimeout(() => {
			toasts.update((currentToasts) =>
				currentToasts.filter((toast) => toast.id !== id),
			);
		}, delay);
}

function createToast(message: string, type: ToastType, options?: ToastOptions) {
	const id = toastId++;
	toasts.update((currentToasts) => [
		...currentToasts,
		{
			id,
			message,
			type,
			options: mergeToastOptions(type, options),
		},
	]);
	removeToastAfterDelay(id, options?.duration);
	return id;
}

function updateToast(
	id: number,
	message: string,
	type: ToastType,
	options?: ToastOptions,
) {
	toasts.update((currentToasts) =>
		currentToasts.map((toast) =>
			toast.id === id
				? {
						id,
						message,
						type,
						options: mergeToastOptions(type, options),
					}
				: toast,
		),
	);
	removeToastAfterDelay(id, options?.duration);
}

export function setDefaultToastOptions(options: {
	position?: MergedToastOptions["position"];
	duration?: MergedToastOptions["duration"];
	icons?: { [type in ToastType]?: MergedToastOptions["icon"] };
	dismissOnClick?: boolean;
}) {
	if (options.position) defaultOptions.position = options.position;
	if (options.duration) defaultOptions.duration = options.duration;
	if (options.icons) {
		defaultOptions.icons = {
			...defaultOptions.icons,
			...options.icons,
		};
	}
	if (options.dismissOnClick !== undefined)
		defaultOptions.dismissOnClick = options.dismissOnClick;
}

export function clearToasts() {
	toasts.set([]);
}

export function removeToast(id: number) {
	toasts.update((currentToasts) =>
		currentToasts.filter((toast) => toast.id !== id),
	);
}

const toast = (message: string, options?: ToastOptions) =>
	createToast(message, "default", options);
toast.info = (message: string, options?: ToastOptions) =>
	createToast(message, "info", options);
toast.success = (message: string, options?: ToastOptions) =>
	createToast(message, "success", options);
toast.warning = (message: string, options?: ToastOptions) =>
	createToast(message, "warning", options);
toast.error = (message: string, options?: ToastOptions) =>
	createToast(message, "error", options);
toast.promise = async <T>(
	promise: Promise<T>,
	messages: {
		loading: string;
		success: string | ((arg: T) => string);
		error: string | ((arg: any) => string);
	},
	options?: ToastOptions,
) => {
	const id = createToast(messages.loading, "loading", {
		...options,
		icon: LoadingIcon,
		duration: 0,
	});

	try {
		const data = await promise;
		updateToast(
			id,
			typeof messages.success === "function"
				? messages.success(data)
				: messages.success,
			"success",
			options,
		);
		return data;
	} catch (error) {
		updateToast(
			id,
			typeof messages.error === "function"
				? messages.error(error)
				: messages.error,
			"error",
			options,
		);
		return error;
	}
};

export default toast;
