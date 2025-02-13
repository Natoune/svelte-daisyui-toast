<script lang="ts">
	import type { Toast } from "$lib";
	import _toast from "$lib";

	export let toast: Toast;
	export let someProp: string;
</script>

<span>
	Custom and <b>bold</b> with props like {someProp}!
	<button
		class="btn btn-xs btn-neutral btn-outline ml-2"
		onclick={() => _toast.dismiss(toast.id)}
	>
		Dismiss
	</button>
</span>
