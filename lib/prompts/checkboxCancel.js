import {
  Separator,
  ValidationError,
  createPrompt,
  isDownKey,
  isEnterKey,
  isNumberKey,
  isSpaceKey,
  isUpKey,
  makeTheme,
  useKeypress,
  useMemo,
  usePagination,
  usePrefix,
  useState,
} from '@inquirer/core';
import { cursorHide } from '@inquirer/ansi';
import { styleText } from 'node:util';
import figures from '@inquirer/figures';

const checkboxTheme = {
  icon: {
    checked: styleText('green', figures.circleFilled),
    unchecked: figures.circle,
    cursor: figures.pointer,
  },
  style: {
    disabledChoice: (text) => styleText('dim', `- ${text}`),
    renderSelectedChoices: (selectedChoices) =>
      selectedChoices.map((choice) => choice.short).join(', '),
    description: (text) => styleText('cyan', text),
    keysHelpTip: (keys) =>
      keys
        .map(([key, action]) => `${styleText('bold', key)} ${styleText('dim', action)}`)
        .join(styleText('dim', ' • ')),
  },
  keybindings: [],
};

function isSelectable(item) {
  return !Separator.isSeparator(item) && !item.disabled;
}

function isChecked(item) {
  return isSelectable(item) && item.checked;
}

function toggle(item) {
  return isSelectable(item) ? { ...item, checked: !item.checked } : item;
}

function check(checked) {
  return function (item) {
    return isSelectable(item) ? { ...item, checked } : item;
  };
}

function normalizeChoices(choices) {
  return choices.map((choice) => {
    if (Separator.isSeparator(choice)) return choice;
    if (typeof choice === 'string') {
      return {
        value: choice,
        name: choice,
        short: choice,
        checkedName: choice,
        disabled: false,
        checked: false,
      };
    }
    const name = choice.name ?? String(choice.value);
    const normalizedChoice = {
      value: choice.value,
      name,
      short: choice.short ?? name,
      checkedName: choice.checkedName ?? name,
      disabled: choice.disabled ?? false,
      checked: choice.checked ?? false,
    };
    if (choice.description) {
      normalizedChoice.description = choice.description;
    }
    return normalizedChoice;
  });
}

const checkboxCancel = createPrompt((config, done) => {
  const {
    pageSize = 7,
    loop = true,
    required,
    validate = () => true,
    cancelValue = 'cancel',
  } = config;
  
  // Shortcuts handling - allow disabling by setting to false or null
  const shortcuts = { 
    all: config.shortcuts?.all === undefined ? 'a' : config.shortcuts.all,
    invert: config.shortcuts?.invert === undefined ? 'i' : config.shortcuts.invert
  };
  
  const theme = makeTheme(checkboxTheme, config.theme);
  const { keybindings } = theme;
  const [status, setStatus] = useState('idle');
  const prefix = usePrefix({ status, theme });
  const [items, setItems] = useState(normalizeChoices(config.choices));
  const bounds = useMemo(() => {
    const first = items.findIndex(isSelectable);
    const last = items.findLastIndex(isSelectable);
    if (first === -1) {
      throw new ValidationError('[checkbox prompt] No selectable choices. All choices are disabled.');
    }
    return { first, last };
  }, [items]);
  const [active, setActive] = useState(bounds.first);
  const [errorMsg, setError] = useState();
  const [cancelled, setCancelled] = useState(false);

  useKeypress(async (key) => {
    if (key.name?.toLowerCase() === 'q') {
      setCancelled(true);
      setStatus('done');
      done([cancelValue]);
      return;
    }
    if (isEnterKey(key)) {
      const activeItem = items[active];
      
      // If the active item IS the cancel option, cancel immediately
      if (isSelectable(activeItem) && activeItem.value === cancelValue) {
        setCancelled(true);
        setStatus('done');
        done([cancelValue]);
        return;
      }

      // If ANY checked item is the cancel option, cancel immediately
      const anyCancelChecked = items.some(
        (item) => isSelectable(item) && item.value === cancelValue && item.checked
      );
      if (anyCancelChecked) {
        setCancelled(true);
        setStatus('done');
        done([cancelValue]);
        return;
      }

      const selection = items.filter(isChecked);
      const isValid = await validate([...selection]);
      if (required && selection.length === 0) {
        setError('At least one choice must be selected');
      } else if (isValid === true) {
        setStatus('done');
        done(selection.map((choice) => choice.value));
      } else {
        setError(isValid || 'You must select a valid value');
      }
    } else if (isUpKey(key, keybindings) || isDownKey(key, keybindings)) {
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
    } else if (isSpaceKey(key)) {
      setError(undefined);
      setItems(items.map((choice, i) => (i === active ? toggle(choice) : choice)));
    } else if (shortcuts.all && key.name === shortcuts.all) {
      const selectAll = items.some((choice) => isSelectable(choice) && !choice.checked && choice.value !== cancelValue);
      setItems(items.map((item) => {
        if (isSelectable(item) && item.value !== cancelValue) {
          return { ...item, checked: selectAll };
        }
        return item;
      }));
    } else if (shortcuts.invert && key.name === shortcuts.invert) {
      setItems(items.map((item) => {
        if (isSelectable(item) && item.value !== cancelValue) {
          return toggle(item);
        }
        return item;
      }));
    } else if (isNumberKey(key)) {
      const selectedIndex = Number(key.name) - 1;
      let selectableIndex = -1;
      const position = items.findIndex((item) => {
        if (Separator.isSeparator(item)) return false;
        selectableIndex++;
        return selectableIndex === selectedIndex;
      });
      const selectedItem = items[position];
      if (selectedItem && isSelectable(selectedItem)) {
        setActive(position);
        setItems(items.map((choice, i) => (i === position ? toggle(choice) : choice)));
      }
    }
  });

  const message = theme.style.message(config.message, status);
  let description;
  const page = usePagination({
    items,
    active,
    renderItem({ item, isActive }) {
      if (Separator.isSeparator(item)) {
        return ` ${item.separator}`;
      }
      if (item.disabled) {
        const disabledLabel = typeof item.disabled === 'string' ? item.disabled : '(disabled)';
        return theme.style.disabledChoice(`${item.name} ${disabledLabel}`);
      }
      if (isActive) {
        description = item.description;
      }
      const checkbox = item.checked ? theme.icon.checked : theme.icon.unchecked;
      const name = item.checked ? item.checkedName : item.name;
      const color = isActive ? theme.style.highlight : (x) => x;
      const cursor = isActive ? theme.icon.cursor : ' ';
      return color(`${cursor}${checkbox} ${name}`);
    },
    pageSize,
    loop,
  });

  if (status === 'done') {
    if (cancelled) {
      return [prefix, message].filter(Boolean).join(' ');
    }
    const selection = items.filter(item => isChecked(item) && item.value !== cancelValue);
    const answer = theme.style.answer(theme.style.renderSelectedChoices(selection, items));
    return [prefix, message, answer].filter(Boolean).join(' ');
  }

  const keys = [
    ['↑↓', 'navigate'],
    ['space', 'select'],
  ];
  if (shortcuts.all) keys.push([shortcuts.all, 'all']);
  if (shortcuts.invert) keys.push([shortcuts.invert, 'invert']);
  keys.push(['⏎', 'submit']);
  keys.push(['q', 'quit']);
  const helpLine = theme.style.keysHelpTip(keys);
  const lines = [
    [prefix, message].filter(Boolean).join(' '),
    page,
    ' ',
    description ? theme.style.description(description) : '',
    errorMsg ? theme.style.error(errorMsg) : '',
    helpLine,
  ]
    .filter(Boolean)
    .join('\n')
    .trimEnd();
  return `${lines}${cursorHide}`;
});

export { Separator };
export default checkboxCancel;
