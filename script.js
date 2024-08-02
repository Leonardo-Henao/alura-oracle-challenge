/**
 * Get element by id
 * @param [string] id id from HTML element
 */
const getById = (id) => document.getElementById(id);

// GUI Elements
const toast = getById('toast');
const texAreaEntry = getById('text_to_convert');
const sectionOutput = getById('section_output');
const texAreaOutput = getById('text_from_convert');
const contentNoData = getById('no_data');

// Keys to encrypt and decrypt
const keysEncryptDencrypt = [
  { key: 'a', value: 'ai' },
  { key: 'e', value: 'enter' },
  { key: 'i', value: 'imes' },
  { key: 'o', value: 'ober' },
  { key: 'u', value: 'ufat' },
];

var showKeysTooltip = false;

/**
 * Handler to button encrypt
 */
const encryptHandler = () => {
  if (!textAreaIsEmpty()) encrypt();
  else showToast('Debes ingresar un texto para encriptar');
};

/**
 * Handler to button decrypt
 */
const decryptHandler = () => {
  if (!textAreaIsEmpty()) decrypt();
  else showToast('Debes ingresar un texto para desencryptar');
};

/**
 * Encrypt the text
 */
const encrypt = () => {
  const value = getTextAreaValue();
  const arrayValue = Array.from(value);

  const result = arrayValue
    .map((x) => {
      const findCharacter = keysEncryptDencrypt.find((y) => y['key'] == x);
      return findCharacter ? findCharacter['value'] : x;
    })
    .join('');

  setResultToTextAreaOutput(result);
  handlerViewImageNoData();
};

/**
 * Decrypt the text
 */
const decrypt = () => {
  let value = getTextAreaValue();
  keysEncryptDencrypt.forEach((x) => (value = value.replace(new RegExp(x['value'], 'g'), x['key'])));

  setResultToTextAreaOutput(value);
  handlerViewImageNoData();
};

/**
 * Set result to TexAreaOutput
 * @param result [string] text to show
 */
const setResultToTextAreaOutput = (result) => {
  texAreaOutput.value = result;
  if (showKeysTooltip) getById('btn_copy').appendChild(setKeyButton('C'));
};

/**
 * Control view to TexAreaOutput and image when TextAreaOutput is empty
 */
const handlerViewImageNoData = () => {
  const data = texAreaOutput.value.length;
  if (data > 0) {
    sectionOutput.style.display = 'flex';
    contentNoData.style.display = 'none';
  } else {
    sectionOutput.style.display = 'none';
    contentNoData.style.display = 'flex';
  }
};

/**
 * Clan all text in texAreas
 */
const cleanAllHandler = () => {
  if (texAreaEntry.value.length == 0 && texAreaOutput.value.length == 0) {
    showToast('No hay datos para limpiar');
    return;
  }
  texAreaEntry.value = '';
  texAreaOutput.value = '';
  handlerViewImageNoData();
};

/**
 * Copy to clipboard the text converted
 */
const copyTextHandler = () => {
  const text = texAreaOutput.value;
  const type = 'text/plain';

  if (ClipboardItem.supports(type)) {
    const blob = new Blob([text], { type });
    const data = [new ClipboardItem({ [type]: blob })];
    navigator.clipboard.write(data);
    showToast('Texto copiado');
  } else console.log('No soportado');
};

/**
 * Show information text to user
 */
const showTextAlertHandler = () => showToast('Solo letras sin acentos');

/**
 * Get the text from texArea
 * @returns [string] with text value
 */
const getTextAreaValue = () => texAreaEntry.value.toString().toLowerCase();

/**
 * Check if texArea is empty
 * @returns [boolean] with value if empty or not
 */
const textAreaIsEmpty = () => !texAreaEntry.value.length > 0;

/**
 * Check theme in localStorage
 */
const checkTheme = () => {
  const valueLocal = localStorage.getItem('t');
  valueLocal != undefined && document.body.setAttribute('theme', valueLocal);
};

/**
 * Change theme
 */
const changeTheme = () => {
  const theme = document.body.getAttribute('theme');
  if (theme === 'light') {
    document.body.setAttribute('theme', 'dark');
    localStorage.setItem('t', 'dark');
  } else {
    document.body.setAttribute('theme', 'light');
    localStorage.setItem('t', 'light');
  }
};

/**
 * Show a toast message
 * @param message text to show
 */
const showToast = (message) => {
  toast.setAttribute('show', true);
  toast.innerHTML = message;

  setTimeout(() => {
    toast.setAttribute('show', false);
  }, 5000);
};

/**
 * Handler tooltip view on all buttons
 */
const buttonKeyTooltipHandler = () => {
  const allTooltipKeys = Array.from(document.getElementsByClassName('key_button_tooltip'));
  if (showKeysTooltip) {
    showKeysTooltip = false;
    allTooltipKeys.forEach((x) => x.remove());
  } else {
    showKeysTooltip = true;
    appendChildTooltips();
  }
};

/**
 * Set key event listener
 */
document.addEventListener('keydown', (event) => {
  const key = event.key.toLowerCase();
  const textAreaFocused = texAreaEntry === document.activeElement;

  if (textAreaFocused && key === 'escape') texAreaEntry.blur();
  else if (!textAreaFocused) {
    switch (key) {
      case 'k':
        buttonKeyTooltipHandler();
        break;
      case 'e':
        encryptHandler();
        break;
      case 'd':
        decryptHandler();
        break;
      case 'r':
        cleanAllHandler();
        break;
      case 'c':
        copyTextHandler();
        break;
      case 't':
        texAreaEntry.focus();
        break;
      case 'escape':
        if (showKeysTooltip) buttonKeyTooltipHandler();
        break;
    }
  }
});

/**
 * Create key tooltip
 */
const setKeyButton = (key) => {
  const div = document.createElement('div');
  div.setAttribute('class', 'key_button_tooltip');
  div.innerHTML = key;
  return div;
};

/**
 * Add tooltip to all buttons
 */
const appendChildTooltips = () => {
  try {
    getById('section_entry').appendChild(setKeyButton('T: Entrar | Escape: Salir'));
    getById('btn_encrypt').appendChild(setKeyButton('E'));
    getById('btn_dencrypt').appendChild(setKeyButton('D'));
    getById('btn_clean').appendChild(setKeyButton('R'));
    getById('btn_copy').appendChild(setKeyButton('C'));
  } catch {}
};

setTimeout(() => {
  getById('transitions-anim').style.display = 'none';
}, 6300);

checkTheme();
