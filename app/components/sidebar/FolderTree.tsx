'use client';

import React, { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FileText } from 'lucide-react';
import { useNoteStore } from '@/app/stores/note-store';
import { useFolderStore } from '@/app/stores/folder-store';

interface TreeNode {
  id: string;
  title: string;
  type: 'folder' | 'note';
  children?: TreeNode[];
}

export const FolderTree = () => {
  const { notes, currentNote, setCurrentNote } = useNoteStore();
  const { folders } = useFolderStore();
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const renderTreeNode = (node: TreeNode, level: number = 0) => {
    const isFolder = node.type === 'folder';
    const isExpanded = expandedFolders.has(node.id);
    const isSelected = currentNote?.id === node.id;

    return (
      <div key={node.id} className="relative group">
        <button
          onClick={() => isFolder ? toggleFolder(node.id) : setCurrentNote(node as any)}
          className={`w-full flex items-center space-x-1 px-2 py-1 text-sm hover:bg-gray-100 dark:hover:bg-gray-700 rounded-md ${
            isSelected ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400' : 'text-gray-700 dark:text-gray-300'
          }`}
          style={{ paddingLeft: `${level * 12 + 8}px` }}
        >
          {isFolder ? (
            <>
              {isExpanded ? (
                <ChevronDown className="h-4 w-4 flex-shrink-0" />
              ) : (
                <ChevronRight className="h-4 w-4 flex-shrink-0" />
              )}
              <Folder className="h-4 w-4 flex-shrink-0" />
            </>
          ) : (
            <>
              <span className="w-4" />
              <FileText className="h-4 w-4 flex-shrink-0" />
            </>
          )}
          <span className="truncate">{node.title}</span>
        </button>
        {isFolder && isExpanded && node.children?.map(child => renderTreeNode(child, level + 1))}
      </div>
    );
  };

  // Build tree structure from flat data
  const buildTree = () => {
    const rootNodes: TreeNode[] = [];
    const folderMap = new Map<string, TreeNode>();

    // First, create all folder nodes
    if (folders) {
      folders.forEach(folder => {
        folderMap.set(folder.id, {
          id: folder.id,
          title: folder.title,
          type: 'folder',
          children: [],
        });
      });

      // Then, build the folder hierarchy
      folders.forEach(folder => {
        const node = folderMap.get(folder.id)!;
        if (folder.parentId) {
          const parent = folderMap.get(folder.parentId);
          if (parent) {
            parent.children = parent.children || [];
            parent.children.push(node);
          }
        } else {
          rootNodes.push(node);
        }
      });
    }

    // Finally, add notes to their respective folders
    if (notes) {
      notes.forEach(note => {
        const noteNode: TreeNode = {
          id: note.id,
          title: note.title,
          type: 'note',
        };

        if (note.folderId) {
          const parent = folderMap.get(note.folderId);
          if (parent) {
            parent.children = parent.children || [];
            parent.children.push(noteNode);
          }
        } else {
          rootNodes.push(noteNode);
        }
      });
    }

    return rootNodes;
  };

  const treeData = buildTree();

  return (
    <div className="space-y-0.5 py-2">
      {treeData.map(node => renderTreeNode(node))}
      {treeData.length === 0 && (
        <div className="px-4 py-2 text-sm text-gray-500 dark:text-gray-400">
          No notes or folders yet
        </div>
      )}
    </div>
  );
};
