<script lang="ts">
	import { removeToast, toasts } from "./toast";
	import type { MergedToastOptions, Toast } from "./types";

	let toastList: Array<Toast> = [];
	let toastPositions: Set<MergedToastOptions["position"]> = new Set();

	toasts.subscribe((value) => {
		toastList = value;
		toastPositions = new Set(value.map((toast) => toast.options.position));
	});
</script>

{#each Array.from(toastPositions).map( (position) => position.split("-") ) as [vertical, horizontal]}
	<div
		class="z-50 toast toast-{vertical} toast-{horizontal}"
		class:items-start={horizontal === "start"}
		class:items-center={horizontal === "center"}
		class:items-end={horizontal === "end"}
	>
		{#each toastList.filter((toast) => toast.options.position === `${vertical}-${horizontal}`) as { id, message, type, options: { icon, dismissOnClick } }}
			<!-- svelte-ignore a11y_click_events_have_key_events -->
			<!-- svelte-ignore a11y_no_noninteractive_element_interactions -->
			<div
				id="toast-{id}"
				role="alert"
				class="alert w-fit transition-transform duration-300 ease-in-out"
				class:alert-info={type === "info"}
				class:alert-success={type === "success"}
				class:alert-warning={type === "warning"}
				class:alert-error={type === "error"}
				onclick={() => dismissOnClick && removeToast(id)}
			>
				{#if icon}
					{#if typeof icon === "string"}
						{@html icon}
					{:else}
						<svelte:component this={icon} />
					{/if}
				{/if}
				<span>{@html message}</span>
			</div>
		{/each}
	</div>
{/each}
