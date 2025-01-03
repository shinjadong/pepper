import React from 'react';

export type InputChangeEventHandler = React.ChangeEventHandler<HTMLInputElement>;
export type TextareaChangeEventHandler = React.ChangeEventHandler<HTMLTextAreaElement>;
export type SelectChangeEventHandler = React.ChangeEventHandler<HTMLSelectElement>;

export interface ContextMenuI {
  show: boolean;
  x: number;
  y: number;
}

export interface MenuI {
  name: string;
  icon: React.JSX.Element;
}

export interface FolderI {
  id: string;
  title: string;
  notes: FileI[];
  type: string;
  children: FolderI[];
}

export interface FileI {
  id: string;
  title: string;
  type: string;
  markdown: string | null;
  folderId: string | null;
}

export interface DragOverlayI {
  title: string;
  type: string;
  children: React.ReactNode;
}

export interface DraggableI {
  id: string;
  type: string;
  title: string;
  children: React.ReactNode;
}

export interface DraggingItemI {
  title: string;
  type: string;
}

export interface BreadcrumbsI {
  id: string;
  title: string;
}

export interface SplitDataI {
  folderId: null;
  id: string;
  markdown: string;
  title: string;
  type: string;
}
