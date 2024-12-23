'use client';
import Link from 'next/link';
import Button from '../ui/button';
import { useRouter } from 'next/navigation';
import { useDeleteNote } from '@/api-calls/notes';
import { FilePenLine, Trash2, SquareSplitHorizontal } from 'lucide-react';
import { useModal } from '@/app/context/modal-context';
import dynamic from 'next/dynamic';

const Popover = dynamic(() => import('../popover/popover'), { ssr: true });

interface Props {
  id: string;
  toggleSplitWindow: () => void;
}

const NoteControlls = ({ id, toggleSplitWindow }: Props) => {
  const { push } = useRouter();
  const { deleteNote } = useDeleteNote();
  const { setModalContent, openModal, closeModal } = useModal();

  const deleteNoteHandler = async () => {
    await deleteNote(id);
    closeModal();
    push('/');
  };

  const showModal = () => {
    setModalContent(
      <>
        <p className="font-bold text-center text-nowrap text-text-color">
          정말로 이 노트를 삭제하시겠습니까?
        </p>
        <div className="flex justify-center gap-4 mt-4">
          <Button onClick={closeModal}>취소</Button>
          <Button onClick={deleteNoteHandler} variant="danger">
            삭제
          </Button>
        </div>
      </>
    );
    openModal();
  };

  return (
    <div className="flex items-center gap-2">
      <Link href={`/note/${id}/edit`}>
        <Button variant="ghost" size="icon">
          <FilePenLine className="w-4 h-4" />
        </Button>
      </Link>
      <Button variant="ghost" size="icon" onClick={toggleSplitWindow}>
        <SquareSplitHorizontal className="w-4 h-4" />
      </Button>
      <Popover>
        <Button variant="ghost" size="icon" onClick={showModal}>
          <Trash2 className="w-4 h-4" />
        </Button>
      </Popover>
    </div>
  );
};

export default NoteControlls;
