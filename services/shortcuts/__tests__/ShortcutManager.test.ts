import { ShortcutManager } from '../ShortcutManager';
import { ShortcutDefinition } from '@/types/shortcuts';

describe('ShortcutManager', () => {
  let manager: ShortcutManager;
  let mockAction: jest.Mock;
  let mockEventHandler: jest.Mock;
  let testShortcut: ShortcutDefinition;

  beforeEach(() => {
    mockAction = jest.fn();
    mockEventHandler = jest.fn();
    testShortcut = {
      id: 'test-shortcut',
      key: 'a',
      modifiers: ['ctrl'],
      description: 'Test shortcut',
      category: 'editor',
      action: mockAction,
    };
    manager = new ShortcutManager({ shortcuts: [] });
  });

  afterEach(() => {
    manager.destroy();
    jest.clearAllMocks();
  });

  describe('registration', () => {
    it('should register a shortcut', () => {
      manager.register(testShortcut);
      expect(manager.isRegistered(testShortcut.id)).toBe(true);
    });

    it('should throw when registering duplicate shortcut', () => {
      manager.register(testShortcut);
      expect(() => manager.register(testShortcut)).toThrow();
    });

    it('should unregister a shortcut', () => {
      manager.register(testShortcut);
      manager.unregister(testShortcut.id);
      expect(manager.isRegistered(testShortcut.id)).toBe(false);
    });
  });

  describe('event handling', () => {
    it('should add and remove event listeners', () => {
      manager.addEventListener(mockEventHandler);
      manager.register(testShortcut);
      expect(mockEventHandler).toHaveBeenCalled();

      manager.removeEventListener(mockEventHandler);
      manager.register({
        ...testShortcut,
        id: 'another-shortcut',
      });
      expect(mockEventHandler).toHaveBeenCalledTimes(1);
    });
  });

  describe('shortcut triggering', () => {
    beforeEach(() => {
      manager.register(testShortcut);
    });

    it('should trigger shortcut action', async () => {
      await manager.trigger(testShortcut.id);
      expect(mockAction).toHaveBeenCalled();
    });

    it('should not trigger disabled shortcut', async () => {
      const disabledShortcut: ShortcutDefinition = {
        ...testShortcut,
        id: 'disabled-shortcut',
        enabled: false,
      };
      manager.register(disabledShortcut);
      await manager.trigger(disabledShortcut.id);
      expect(mockAction).not.toHaveBeenCalled();
    });
  });

  describe('keyboard events', () => {
    it('should handle keyboard events', () => {
      manager.register(testShortcut);

      const event = new KeyboardEvent('keydown', {
        key: 'a',
        ctrlKey: true,
      });
      window.dispatchEvent(event);

      expect(mockAction).toHaveBeenCalled();
    });

    it('should not trigger on non-matching keyboard events', () => {
      manager.register(testShortcut);

      const event = new KeyboardEvent('keydown', {
        key: 'b',
        ctrlKey: true,
      });
      window.dispatchEvent(event);

      expect(mockAction).not.toHaveBeenCalled();
    });
  });

  describe('utility methods', () => {
    it('should get registered shortcut', () => {
      manager.register(testShortcut);
      const retrieved = manager.getShortcut(testShortcut.id);
      expect(retrieved).toEqual(expect.objectContaining(testShortcut));
    });

    it('should get all shortcuts', () => {
      manager.register(testShortcut);
      const shortcuts = manager.getAllShortcuts();
      expect(shortcuts).toHaveLength(1);
      expect(shortcuts[0]).toEqual(expect.objectContaining(testShortcut));
    });
  });
});
