import {
  ShortcutDefinition,
  ShortcutMap,
  ShortcutManagerConfig,
  ShortcutEvent,
  ShortcutEventHandler,
  ModifierKey,
} from '../../types/shortcuts';

export class ShortcutManager {
  private shortcuts: ShortcutMap = {};
  private eventHandlers: Set<ShortcutEventHandler> = new Set();
  private config: Required<ShortcutManagerConfig>;

  constructor(config: ShortcutManagerConfig) {
    this.config = {
      shortcuts: config.shortcuts || [],
      enableLogging: config.enableLogging ?? false,
      preventDefault: config.preventDefault ?? true,
      stopPropagation: config.stopPropagation ?? true,
    };

    this.handleKeyDown = this.handleKeyDown.bind(this);

    this.init();
  }

  private init(): void {
    this.config.shortcuts.forEach((shortcut) => this.register(shortcut));
    if (typeof window !== 'undefined') {
      this.setupKeyboardListener();
    }
  }

  private setupKeyboardListener(): void {
    window.addEventListener('keydown', this.handleKeyDown);
  }

  private cleanup(): void {
    if (typeof window !== 'undefined') {
      window.removeEventListener('keydown', this.handleKeyDown);
    }
  }

  private handleKeyDown(event: KeyboardEvent): void {
    if (!event.key) return;

    const pressedModifiers = this.getPressedModifiers(event);
    const pressedKey = event.key.toLowerCase();

    for (const shortcut of Object.values(this.shortcuts)) {
      if (!shortcut.enabled) continue;

      const shortcutKey = shortcut.key.toLowerCase();
      const shortcutModifiers = shortcut.modifiers.map((mod) => mod.toLowerCase());

      if (
        pressedKey === shortcutKey &&
        pressedModifiers.length === shortcutModifiers.length &&
        pressedModifiers.every((mod) => shortcutModifiers.includes(mod.toLowerCase()))
      ) {
        if (this.config.preventDefault) event.preventDefault();
        if (this.config.stopPropagation) event.stopPropagation();

        this.trigger(shortcut.id).catch((error) => {
          this.emitEvent({
            type: 'shortcut-error',
            shortcutId: shortcut.id,
            timestamp: Date.now(),
            error,
          });
        });
        break;
      }
    }
  }

  private getPressedModifiers(event: KeyboardEvent): ModifierKey[] {
    const modifiers: ModifierKey[] = [];
    if (event.ctrlKey) modifiers.push('ctrl');
    if (event.shiftKey) modifiers.push('shift');
    if (event.altKey) modifiers.push('alt');
    if (event.metaKey) modifiers.push('meta');
    return modifiers;
  }

  private emitEvent(event: ShortcutEvent): void {
    if (this.config.enableLogging) {
      console.log(`Shortcut event: ${event.type}`, event);
    }

    this.eventHandlers.forEach((handler) => {
      try {
        handler(event);
      } catch (error) {
        console.error('Error in shortcut event handler:', error);
      }
    });
  }

  register(shortcut: ShortcutDefinition): void {
    if (this.shortcuts[shortcut.id]) {
      throw new Error(`Shortcut with id "${shortcut.id}" is already registered`);
    }

    this.shortcuts[shortcut.id] = {
      ...shortcut,
      enabled: shortcut.enabled ?? true,
    };

    this.emitEvent({
      type: 'shortcut-registered',
      shortcutId: shortcut.id,
      timestamp: Date.now(),
    });
  }

  unregister(shortcutId: string): void {
    delete this.shortcuts[shortcutId];
  }

  async trigger(shortcutId: string): Promise<void> {
    const shortcut = this.shortcuts[shortcutId];
    if (!shortcut || !shortcut.enabled) return;

    try {
      await shortcut.action();
      this.emitEvent({
        type: 'shortcut-triggered',
        shortcutId,
        timestamp: Date.now(),
      });
    } catch (error) {
      this.emitEvent({
        type: 'shortcut-error',
        shortcutId,
        timestamp: Date.now(),
        error: error as Error,
      });
      throw error;
    }
  }

  isRegistered(shortcutId: string): boolean {
    return shortcutId in this.shortcuts;
  }

  getShortcut(shortcutId: string): ShortcutDefinition | undefined {
    return this.shortcuts[shortcutId];
  }

  getAllShortcuts(): ShortcutDefinition[] {
    return Object.values(this.shortcuts);
  }

  addEventListener(handler: ShortcutEventHandler): void {
    this.eventHandlers.add(handler);
  }

  removeEventListener(handler: ShortcutEventHandler): void {
    this.eventHandlers.delete(handler);
  }

  destroy(): void {
    this.cleanup();
    this.eventHandlers.clear();
    this.shortcuts = {};
  }
}
