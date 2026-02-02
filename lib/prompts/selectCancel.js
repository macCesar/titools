import {
  Separator,
  ValidationError,
  createPrompt,
  isBackspaceKey,
  isDownKey,
  isEnterKey,
  isNumberKey,
  isUpKey,
  makeTheme,
  useEffect,
  useKeypress,
  useMemo,
  usePagination,
  usePrefix,
  useRef,
  useState,
} from '@inquirer/core';
import { cursorHide } from '@inquirer/ansi';
import { styleText } from 'node:util';
import figures from '@inquirer/figures';

const selectTheme = {
  icon: { cursor: figures.pointer },
  style: {
    disabled: (text) => styleText('dim', `- ${text}`),
    description: (text) => styleText('cyan', text),
    keysHelpTip: (keys) =>
      keys
        .map(([key, action]) => `${styleText('bold', key)} ${styleText('dim', action)}`)
        .join(styleText('dim', ' • ')),
  },
  indexMode: 'hidden',
  keybindings: [],
};

function isSelectable(item) {
  return !Separator.isSeparator(item) && !item.disabled;
}

function normalizeChoices(choices) {
  return choices.map((choice) => {
    if (Separator.isSeparator(choice)) return choice;
    if (typeof choice !== 'object' || choice === null || !('value' in choice)) {
      const name = String(choice);
      return {
        value: choice,
        name,
        short: name,
        disabled: false,
      };
    }
    const name = choice.name ?? String(choice.value);
    const normalizedChoice = {
      value: choice.value,
      name,
      short: choice.short ?? name,
      disabled: choice.disabled ?? false,
    };
    if (choice.description) {
      normalizedChoice.description = choice.description;
    }
    return normalizedChoice;
  });
}

const selectCancel = createPrompt((config, done) => {
  const { loop = true, pageSize = 7, cancelValue = 'cancel' } = config;
  const theme = makeTheme(selectTheme, config.theme);
  const { keybindings } = theme;
  const [status, setStatus] = useState('idle');
  const [cancelled, setCancelled] = useState(false);
  const prefix = usePrefix({ status, theme });
  const searchTimeoutRef = useRef();
  const searchEnabled = !keybindings.includes('vim');
  const items = useMemo(() => normalizeChoices(config.choices), [config.choices]);
  const bounds = useMemo(() => {
    const first = items.findIndex(isSelectable);
    const last = items.findLastIndex(isSelectable);
    if (first === -1) {
      throw new ValidationError('[select prompt] No selectable choices. All choices are disabled.');
    }
    return { first, last };
  }, [items]);
  const defaultItemIndex = useMemo(() => {
    if (!('default' in config)) return -1;
    return items.findIndex((item) => isSelectable(item) && item.value === config.default);
  }, [config.default, items]);
  const [active, setActive] = useState(defaultItemIndex === -1 ? bounds.first : defaultItemIndex);
  const selectedChoice = items[active];

  useKeypress((key, rl) => {
    clearTimeout(searchTimeoutRef.current);
    if (key.name?.toLowerCase() === 'q') {
      setCancelled(true);
      setStatus('done');
      done(cancelValue);
    } else if (isEnterKey(key)) {
      setStatus('done');
      done(selectedChoice.value);
    }
    else if (isUpKey(key, keybindings) || isDownKey(key, keybindings)) {
      rl.clearLine(0);
      if (
        loop ||
        (isUpKey(key, keybindings) && active !== bounds.first) ||
        (isDownKey(key, keybindings) && active !== bounds.last)
      ) {
        const offset = isUpKey(key, keybindings) ? -1 : 1;
        let next = active;
        do {
          next = (next + offset + items.length) % items.length;
        } while (!isSelectable(items[next]));
        setActive(next);
      }
    } else if (isNumberKey(key) && !Number.isNaN(Number(rl.line))) {
      const selectedIndex = Number(rl.line) - 1;
      let selectableIndex = -1;
      const position = items.findIndex((item) => {
        if (Separator.isSeparator(item)) return false;
        selectableIndex++;
        return selectableIndex === selectedIndex;
      });
      const item = items[position];
      if (item != null && isSelectable(item)) {
        setActive(position);
      }
      searchTimeoutRef.current = setTimeout(() => {
        rl.clearLine(0);
      }, 700);
    } else if (isBackspaceKey(key)) {
      rl.clearLine(0);
    } else if (searchEnabled) {
      const searchTerm = rl.line.toLowerCase();
      const matchIndex = items.findIndex((item) => {
        if (Separator.isSeparator(item) || !isSelectable(item)) return false;
        return item.name.toLowerCase().startsWith(searchTerm);
      });
      if (matchIndex !== -1) {
        setActive(matchIndex);
      }
      searchTimeoutRef.current = setTimeout(() => {
        rl.clearLine(0);
      }, 700);
    }
  });

  useEffect(() => () => {
    clearTimeout(searchTimeoutRef.current);
  }, []);

  const message = theme.style.message(config.message, status);
  const helpLine = theme.style.keysHelpTip([
    ['↑↓', 'navigate'],
    ['⏎', 'select'],
    ['q', 'quit'],
  ]);
  let separatorCount = 0;
  const page = usePagination({
    items,
    active,
    renderItem({ item, isActive, index }) {
      if (Separator.isSeparator(item)) {
        separatorCount++;
        return ` ${item.separator}`;
      }
      const indexLabel = theme.indexMode === 'number' ? `${index + 1 - separatorCount}. ` : '';
      if (item.disabled) {
        const disabledLabel = typeof item.disabled === 'string' ? item.disabled : '(disabled)';
        return theme.style.disabled(`${indexLabel}${item.name} ${disabledLabel}`);
      }
      const color = isActive ? theme.style.highlight : (x) => x;
      const cursor = isActive ? theme.icon.cursor : ` `;
      return color(`${cursor} ${indexLabel}${item.name}`);
    },
    pageSize,
    loop,
  });

  if (status === 'done') {
    if (cancelled) {
      return [prefix, message].filter(Boolean).join(' ');
    }
    return [prefix, message, theme.style.answer(selectedChoice.short)]
      .filter(Boolean)
      .join(' ');
  }

  const { description } = selectedChoice;
  const lines = [
    [prefix, message].filter(Boolean).join(' '),
    page,
    ' ',
    description ? theme.style.description(description) : '',
    helpLine,
  ]
    .filter(Boolean)
    .join('\n')
    .trimEnd();
  return `${lines}${cursorHide}`;
});

export { Separator };
export default selectCancel;
