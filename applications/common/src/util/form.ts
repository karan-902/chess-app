import type { FormEvent } from "react";

export const formSubmitHandler = (submit: () => void) => (event: FormEvent) => {
 event.preventDefault();
 submit();
};
