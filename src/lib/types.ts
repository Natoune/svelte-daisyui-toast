import type { Component } from "svelte";

export interface MergedToastOptions {
	position:
		| "top-start"
		| "top-center"
		| "top-end"
		| "middle-start"
		| "middle-center"
		| "middle-end"
		| "bottom-start"
		| "bottom-center"
		| "bottom-end";
	duration: number;
	dismissOnClick: boolean;
	icon?: string | Component<any>;
	props?: Record<string, any>;
}

export interface ToastOptions extends Partial<MergedToastOptions> {}

export type ToastType =
	| "default"
	| "info"
	| "success"
	| "warning"
	| "error"
	| "loading";

export interface Toast {
	id: number;
	message: string | Component<any>;
	type: ToastType;
	options: MergedToastOptions;
}
