import type { Component } from "svelte";
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

function createToast(
	message: Toast["message"],
	type: ToastType,
	options?: ToastOptions,
) {
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
	message: Toast["message"],
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

function instanceOfComponent(object: any): object is Component {
	return "$on" in object;
}

function setDefaultToastOptions(options: {
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

function clear() {
	toasts.set([]);
}

export function dismiss(id: number) {
	toasts.update((currentToasts) =>
		currentToasts.filter((toast) => toast.id !== id),
	);
}

/**
 * Display a toast.
 * @param message The message to display in the toast. Can be an HTML string or a Svelte component.
 * @param options Options to customize the toast.
 * @returns The ID of the created toast.
 */
const toast = (message: Toast["message"], options?: ToastOptions) =>
	createToast(message, "default", options);
/**
 * Display an info toast.
 * @param message The message to display in the toast. Can be an HTML string or a Svelte component.
 * @param options Options to customize the toast.
 * @returns The ID of the created toast.
 */
toast.info = (message: Toast["message"], options?: ToastOptions) =>
	createToast(message, "info", options);
/**
 * Display a success toast.
 * @param message The message to display in the toast. Can be an HTML string or a Svelte component.
 * @param options Options to customize the toast.
 * @returns The ID of the created toast.
 */
toast.success = (message: Toast["message"], options?: ToastOptions) =>
	createToast(message, "success", options);
/**
 * Display a warning toast.
 * @param message The message to display in the toast. Can be an HTML string or a Svelte component.
 * @param options Options to customize the toast.
 * @returns The ID of the created toast.
 */
toast.warning = (message: Toast["message"], options?: ToastOptions) =>
	createToast(message, "warning", options);
/**
 * Display an error toast.
 * @param message The message to display in the toast. Can be an HTML string or a Svelte component.
 * @param options Options to customize the toast.
 * @returns The ID of the created toast.
 */
toast.error = (message: Toast["message"], options?: ToastOptions) =>
	createToast(message, "error", options);
/**
 * Wrap a promise to display a loading toast while the promise is pending.
 * @param promise The promise to wrap.
 * @param messages Messages to display in the loading, success, and error toasts.
 * @param options Options to customize the loading toast.
 * @returns A promise that resolves with the result of the wrapped promise.
 */
toast.promise = async <T>(
	promise: Promise<T>,
	messages: {
		loading: Toast["message"];
		success: Toast["message"] | ((arg: T) => Toast["message"]);
		error: Toast["message"] | ((arg: any) => Toast["message"]);
	},
	options?: ToastOptions,
): Promise<T> => {
	const id = createToast(messages.loading, "loading", {
		...options,
		icon: LoadingIcon,
		duration: 0,
	});

	try {
		const data = await promise;
		updateToast(
			id,
			typeof messages.success === "string" ||
				instanceOfComponent(messages.success)
				? messages.success
				: messages.success(data),
			"success",
			options,
		);
		return data;
	} catch (error) {
		updateToast(
			id,
			typeof messages.error === "string" || instanceOfComponent(messages.error)
				? messages.error
				: messages.error(error),
			"error",
			options,
		);
		return error;
	}
};
/**
 * Set default options for toasts.
 * @param options Options to set as default.
 */
toast.setDefaultOptions = setDefaultToastOptions;
/**
 * Clear all toasts.
 */
toast.clear = clear;
/**
 * Dismiss a toast.
 * @param id The ID of the toast to dismiss.
 */
toast.dismiss = dismiss;

export default toast;
