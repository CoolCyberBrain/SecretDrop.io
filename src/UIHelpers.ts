import { saveAs } from "file-saver";

export function scrollTo(selector: string) {
  scrollToElement(document.querySelector(selector) as Element);
}

export function scrollToY(y: number) {
  window.scrollTo({
    top: y,
    left: 0,
    behavior: "smooth",
  });
}

export function scrollToElement(element: Element | undefined) {
  element?.scrollIntoView({
    behavior: "smooth",
  });
}

export function animateAddTextInElement(
  startingString: string,
  addedString: string,
  duration: number = 500,
  onUpdate?: (newString: string) => void,
  onFinish?: () => void
) {
  const stringLength = addedString.length;
  const startTimestamp = Date.now();

  if (startingString && startingString.length > 0) onUpdate?.(startingString);

  const intervalId = setInterval(() => {
    const timeElapsed = Date.now() - startTimestamp;
    const length = Math.floor(stringLength * (timeElapsed / duration));

    if (length <= stringLength) {
      const shownString = addedString.substring(0, length);
      const newString =
        startingString + fillStringWithRandom(shownString, stringLength);

      onUpdate?.(newString);
    } else {
      onUpdate?.(startingString + addedString);
      onFinish?.();
      clearInterval(intervalId);
    }
  }, 50);
}

export function animateTextTransition(
  startingString: string,
  finalString: string,
  duration: number = 500,
  onUpdate?: (newString: string) => void,
  onFinish?: () => void
) {
  const initialLength = startingString.length;
  const targetLength = finalString.length;
  const lengthDifference = finalString.length - startingString.length;
  const startTimestamp = Date.now();

  onUpdate?.(startingString);
  const intervalId = setInterval(() => {
    const timeElapsed = Date.now() - startTimestamp;
    const timeElapsedRatio = Math.min(timeElapsed / duration, 1);
    const stringLengthΔ = Math.floor(lengthDifference * timeElapsedRatio);
    const stringLength = initialLength + stringLengthΔ;
    const finalStringShownlength = Math.floor(stringLength * timeElapsedRatio);

    if (
      finalStringShownlength != targetLength ||
      stringLength != targetLength
    ) {
      const shownString = finalString.substring(0, finalStringShownlength);
      const newString = fillStringWithRandom(shownString, stringLength);

      onUpdate?.(newString);
    } else {
      onUpdate?.(finalString);
      onFinish?.();
      clearInterval(intervalId);
    }
  }, 50);

  return () => {
    clearInterval(intervalId);
  };
}

export function fillElementWithRandomText(
  length: number = 0,
  onUpdate?: (newString: string) => void
) {
  const intervalId = setInterval(() => {
    onUpdate?.(getRandomStringOfLength(length));
  }, 50);

  return () => {
    clearInterval(intervalId);
  };
}

export function fillStringWithRandom(
  shownString: string,
  desiredLength: number
) {
  return (
    shownString + getRandomStringOfLength(desiredLength - shownString.length)
  );
}

export function getRandomStringOfLength(length: number) {
  let result = "";
  const characters =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  const charactersLength = characters.length;
  for (let i = 0; i < length; i++) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}

export function calculatePreviewSize(parentWidth: number) {
  const parentWidthActual = parentWidth - 8; // for 4px padding on the sides
  for (let i = 90; i <= 120; i++) {
    const totalWidth = i + 8; // for 4px margin on the sides
    if (parentWidthActual % totalWidth === 0) return i;
  }

  return 100;
}

export function downloadAsTxt(s: string, filename: string) {
  const blob = new Blob([s], { type: "text/plain;charset=utf-8" });
  saveAs(blob, filename);
}

export function getPredictedLengthOfEncryptedString(messageLength: number) {
  const publicKeyStringLength = 64;
  const base64Length = Math.max(4 * (messageLength + 44 / 3), 10);
  const totalLength = Math.ceil(publicKeyStringLength + base64Length + 1);

  return totalLength;
}

export function getPredictedLengthOfDecryptedString(stringLength: number) {
  const publicKeyStringLength = 64;
  const base64Length = Math.max(
    3 * ((stringLength - publicKeyStringLength) / 4) - 44,
    10
  );
  const totalLength = Math.ceil(base64Length);

  return totalLength;
}
