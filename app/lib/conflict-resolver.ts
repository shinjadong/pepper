import { Block } from '@/types';
import { getBlock } from './indexed-db';

interface ConflictResolution {
  resolved: Block;
  strategy: 'local' | 'remote' | 'merged';
}

export class ConflictResolver {
  /**
   * 블록 충돌을 해결합니다.
   */
  static async resolve(
    localBlock: Block,
    remoteBlock: Block,
    strategy: 'local' | 'remote' | 'smart' = 'smart'
  ): Promise<ConflictResolution> {
    // 충돌이 없는 경우
    if (localBlock.updatedAt === remoteBlock.updatedAt) {
      return {
        resolved: localBlock,
        strategy: 'local',
      };
    }

    switch (strategy) {
      case 'local':
        return {
          resolved: localBlock,
          strategy: 'local',
        };

      case 'remote':
        return {
          resolved: remoteBlock,
          strategy: 'remote',
        };

      case 'smart':
        return this.smartMerge(localBlock, remoteBlock);

      default:
        throw new Error('Invalid conflict resolution strategy');
    }
  }

  /**
   * 스마트 머지 전략을 사용하여 충돌을 해결합니다.
   */
  private static async smartMerge(
    localBlock: Block,
    remoteBlock: Block
  ): Promise<ConflictResolution> {
    // 텍스트 블록의 경우 내용을 병합
    if (
      localBlock.type === 'text' &&
      remoteBlock.type === 'text' &&
      typeof localBlock.content.text === 'string' &&
      typeof remoteBlock.content.text === 'string'
    ) {
      const mergedText = this.mergeText(
        localBlock.content.text,
        remoteBlock.content.text
      );

      return {
        resolved: {
          ...localBlock,
          content: {
            ...localBlock.content,
            text: mergedText,
          },
          updatedAt: new Date().toISOString(),
        },
        strategy: 'merged',
      };
    }

    // 이미지나 파일의 경우 가장 최근 버전 사용
    const localDate = new Date(localBlock.updatedAt);
    const remoteDate = new Date(remoteBlock.updatedAt);

    return {
      resolved: localDate > remoteDate ? localBlock : remoteBlock,
      strategy: localDate > remoteDate ? 'local' : 'remote',
    };
  }

  /**
   * 두 텍스트를 병합합니다.
   */
  private static mergeText(local: string, remote: string): string {
    if (local === remote) return local;

    // 간단한 차이점 표시
    return `${local}\n\n[충돌 해결됨]\n${remote}`;
  }

  /**
   * 블록의 변경 이력을 추적합니다.
   */
  static async trackChanges(blockId: string): Promise<Block[]> {
    const block = await getBlock(blockId);
    if (!block) return [];

    // TODO: 변경 이력 추적 구현
    return [block];
  }
}
