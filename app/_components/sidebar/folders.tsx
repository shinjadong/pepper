import { useLocalStorage } from "@/app/hooks/useLocalStorage";
import { FolderI, InputChangeEventHandler } from "@/app/types/types";
import FolderWrapper from "../folder/folder-wrapper";
import FolderTitle from "../folder/folder-title";
import FolderControlls from "../folder/folder-controlls";
import FileWrapper from "../file/file-wrapper";
import File from "../ui/file";
import { useState } from "react";
import { FOLDER_STATE } from "@/app/data/initial-state";

interface Props {
  showInput: null | number;
  renameValue: string;
  folders: FolderI[];
  deleteFolder: (id: string) => void;
  onChangeHandler: InputChangeEventHandler;
  onKeyDownHandler: (
    e: React.KeyboardEvent<HTMLInputElement>,
    idx: number
  ) => void;
  changeNameHandler: (
    e: React.MouseEvent<HTMLSpanElement>,
    idx: number,
    name: string
  ) => void;
}

const Folders = ({
  deleteFolder,
  onChangeHandler,
  onKeyDownHandler,
  changeNameHandler,
  renameValue,
  showInput,
  folders,
}: Props) => {
  const [rotatedIcons, setRotatedIcons] = useState(
    Array(FOLDER_STATE.length).fill(false)
  );

  const iconHandler = (e: React.MouseEvent, idx: number) => {
    if ((e.target as HTMLElement).tagName === "INPUT") return;
    setRotatedIcons((prevState) => {
      const newState = [...prevState];
      newState[idx] = !newState[idx];
      return newState;
    });
  };

  return (
    <ul className="px-2 flex flex-col gap-2">
      {folders.map((el: FolderI, idx: number) => (
        <FolderWrapper
          idx={idx}
          id={el.id}
          key={el.id}
          showInput={showInput}
          rotateIcon={rotatedIcons}
          iconHandler={iconHandler}
        >
          <div className="flex items-center justify-between p-2 rounded-full hover:bg-dark-gray-accent">
            <FolderTitle
              idx={idx}
              name={el.name}
              showInput={showInput}
              rotateIcon={rotatedIcons}
              renameValue={renameValue}
              onChangeHandler={onChangeHandler}
              onKeyDownHandler={onKeyDownHandler}
            />
            <FolderControlls
              idx={idx}
              id={el.id}
              name={el.name}
              deleteFolder={deleteFolder}
              changeNameHandler={changeNameHandler}
            />
          </div>
          {el.files?.length && rotatedIcons[idx] ? (
            <FileWrapper type={el.type} id={el.id} title={el.name}>
              {el.files?.map((note) => (
                <File name={note.name} key={note.id} />
              ))}
            </FileWrapper>
          ) : null}
        </FolderWrapper>
      ))}
    </ul>
  );
};

export default Folders;
