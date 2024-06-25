'use client';
import { FormEvent, useState } from 'react';
import Input from '@/components/ui/input';
import Button from '@/components/ui/button';
import { useUpdateNote } from '@/api-calls/notes';
import { useGetNote } from '@/api-calls/note';

interface Props {
  id: string;
}

const EditNoteForm = ({ id }: Props) => {
  const { data } = useGetNote(id);

  const [formData, setFormData] = useState({
    title: data.title,
    note: data.markdown,
  });
  const { updateNote } = useUpdateNote();

  const onChangeHandler = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const onSubmitHandler = async (e: FormEvent) => {
    e.preventDefault();
    const trimValue = formData.title.trim();
    if (trimValue === '') return;
    await updateNote(id, formData.title, formData.note);
  };

  return (
    <form className="w-10/12 flex-auto" onSubmit={onSubmitHandler}>
      <label htmlFor="title" className="text-sm font-bold text-gray uppercase">
        Edit title
      </label>
      <Input
        name="title"
        rounded="md"
        defaultValue={data.title}
        onChange={onChangeHandler}
        required={true}
      />

      <label htmlFor="note" className="block mb-1 mt-5 text-sm font-bold text-gray uppercase">
        Note Info
      </label>
      <textarea
        rows={20}
        name="note"
        onChange={onChangeHandler}
        defaultValue={data.markdown ? data.markdown : ''}
        className="text-gray p-2 w-full rounded-md bg-dark-gray-accent border border-border outline-none focus:ring-2 focus:ring-purple"
      ></textarea>
      <Button
        size="md"
        type="submit"
        font="bolded"
        variants="outlined"
        className="mt-5 w-full text-gray rounded-md uppercase hover:text-white hover:bg-gray/20 hover:border-purple"
      >
        Submit
      </Button>
    </form>
  );
};

export default EditNoteForm;
