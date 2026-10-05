import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { createThread } from "../services/threadApi";

export default function ThreadForm() {
  const queryClient = useQueryClient();

  const {
    register,
    handleSubmit,
    reset,
    setError,
    formState: { errors },
  } = useForm({ defaultValues: { title: "", body: "" } });

  const mutation = useMutation({
    mutationFn: (data) => createThread(data),
    onSuccess: () => {
      queryClient.invalidateQueries({queryKey: ["threads"]});
      reset();
      // TODO 3: close the loop after a successful create.
      // - invalidate the ["threads"] query so the list refetches
      // - reset() the form so the fields clear for the next entry
    },
    onError: (error) => { const fieldErrors = error.response?.data?.errors; if (fieldErrors && Object.keys(fieldErrors).length > 0) { for (const [field, message] of Object.entries(fieldErrors)) { setError(field, { type: "server", message, }); } } else { setError("root.server", { message: "Could not save. Please try again.", }); } }, });
  // TODO 1: handleSubmit runs client validation first, then calls this with valid data.
  // Fire the mutation here.
  const onSubmit = (data) => {
    // call mutation.mutate(data)
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)}>
      <div className="field">
        <label htmlFor="title">Title</label>
        <input
          id="title"
          {...register("title", { required: "Title is required" })}
        />
        {errors.title && <p role="alert">{errors.title.message}</p>}
      </div>

      <div className="field"> <label htmlFor="body">Body</label> <textarea id="body" {...register("body", { required: "Body is required" })} /> {errors.body && <p role="alert">{errors.body.message}</p>} </div> {errors.root?.server && ( <p role="alert">{errors.root.server.message}</p> )} <button type="submit" disabled={mutation.isPending}> {mutation.isPending ? "Creating…" : "Create thread"} </button> </form> ); }