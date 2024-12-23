import { Folder } from '@/types';

export function buildFolderTree(folders: Folder[], parentId: string | null = null): Folder[] {
  return folders
    .filter(folder => folder.parent_id === parentId)
    .map(folder => ({
      ...folder,
      children: buildFolderTree(folders, folder.id),
    }));
}

export function flattenFolderTree(tree: Folder[]): Folder[] {
  return tree.reduce((flat: Folder[], folder) => {
    const { children, ...folderWithoutChildren } = folder;
    return [
      ...flat,
      folderWithoutChildren,
      ...flattenFolderTree(children || []),
    ];
  }, []);
}

export function getFolderDepth(folders: Folder[], folderId: string): number {
  let depth = 0;
  let currentId = folderId;

  while (currentId) {
    const folder = folders.find(f => f.id === currentId);
    if (!folder) break;
    depth++;
    currentId = folder.parent_id;
  }

  return depth;
}

export function getAllDescendants(folders: Folder[], folderId: string): string[] {
  const descendants: string[] = [];
  const stack = [folderId];

  while (stack.length > 0) {
    const currentId = stack.pop()!;
    const children = folders.filter(f => f.parent_id === currentId);
    
    children.forEach(child => {
      descendants.push(child.id);
      stack.push(child.id);
    });
  }

  return descendants;
}

export function canMoveFolder(
  folders: Folder[],
  sourceId: string,
  targetId: string | null
): boolean {
  // 자기 자신으로 이동하는 것 방지
  if (sourceId === targetId) return false;

  // 대상이 루트면 항상 이동 가능
  if (targetId === null) return true;

  // 순환 참조 방지
  const descendants = getAllDescendants(folders, sourceId);
  if (descendants.includes(targetId)) return false;

  return true;
}

export function sortFolders(folders: Folder[]): Folder[] {
  return [...folders].sort((a, b) => {
    // 먼저 부모 폴더 ID로 정렬
    if (a.parent_id === b.parent_id) {
      // 같은 레벨이면 제목으로 정렬
      return a.title.localeCompare(b.title);
    }
    // 부모 폴더가 없는 것을 먼저
    if (a.parent_id === null) return -1;
    if (b.parent_id === null) return 1;
    // 부모 폴더 ID로 정렬
    return a.parent_id.localeCompare(b.parent_id);
  });
}

export function getFolderBreadcrumbs(folders: Folder[], folderId: string | null): Folder[] {
  if (!folderId) return [];

  const breadcrumbs: Folder[] = [];
  let currentId = folderId;

  while (currentId) {
    const folder = folders.find(f => f.id === currentId);
    if (!folder) break;
    breadcrumbs.unshift(folder);
    currentId = folder.parent_id;
  }

  return breadcrumbs;
}
