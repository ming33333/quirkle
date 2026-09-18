import { useCallback, useEffect, useLayoutEffect, useRef, useState } from "react";
import { getCardResult, isCardDue, RESULT_LABELS, updateCardText, deleteCardFromDeck } from "../utils/decks";

const SAVE_DELAY_MS = 650;

const grow = (element) => {
  if (!element) return;
  element.style.height = "auto";
  element.style.height = `${element.scrollHeight}px`;
};

export default function PreviewCard({
  card,
  index,
  email,
  deckId,
  showTags,
  onUpdate,
  onDelete,
  autoFocus = false,
}) {
  const [question, setQuestion] = useState(card.question || "");
  const [answer, setAnswer] = useState(card.answer || "");
  const [status, setStatus] = useState("idle");
  const [confirmDelete, setConfirmDelete] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const questionRef = useRef(null);
  const answerRef = useRef(null);
  const timerRef = useRef(null);
  const inFlightRef = useRef(false);
  const removedRef = useRef(false);
  const savedRef = useRef({
    question: card.question || "",
    answer: card.answer || "",
  });
  const draftRef = useRef({ question, answer });
  draftRef.current = { question, answer };

  const resultTone = getCardResult(card);
  const result = { label: RESULT_LABELS[resultTone], tone: resultTone };
  const due = isCardDue(card);

  const persist = useCallback(async () => {
    if (removedRef.current) return;
    const pending = draftRef.current;
    const alreadySaved = savedRef.current;
    if (
      pending.question === alreadySaved.question &&
      pending.answer === alreadySaved.answer
    ) {
      return;
    }
    if (inFlightRef.current) return;
    inFlightRef.current = true;
    setStatus("saving");
    try {
      while (true) {
        const draft = draftRef.current;
        const saved = savedRef.current;
        if (
          draft.question === saved.question &&
          draft.answer === saved.answer
        ) {
          setStatus("saved");
          return;
        }
        await updateCardText(email, deckId, card.id, draft);
        savedRef.current = {
          question: draft.question,
          answer: draft.answer,
        };
        onUpdate?.(card.id, draft);
      }
    } catch (saveError) {
      console.error("Error saving card:", saveError);
      setStatus("error");
    } finally {
      inFlightRef.current = false;
    }
  }, [card.id, deckId, email, onUpdate]);

  const scheduleSave = useCallback(() => {
    clearTimeout(timerRef.current);
    timerRef.current = setTimeout(() => {
      persist();
    }, SAVE_DELAY_MS);
  }, [persist]);

  useEffect(() => {
    setQuestion(card.question || "");
    setAnswer(card.answer || "");
    savedRef.current = {
      question: card.question || "",
      answer: card.answer || "",
    };
    setStatus("idle");
  }, [card.id]);

  useLayoutEffect(() => {
    grow(questionRef.current);
    grow(answerRef.current);
  }, [question, answer]);

  useLayoutEffect(() => {
    if (!autoFocus) return;
    const field = questionRef.current;
    if (!field) return;
    field.focus();
    field.scrollIntoView({ behavior: "smooth", block: "center" });
  }, [autoFocus]);

  useEffect(() => {
    if (status !== "saved") return undefined;
    const hide = setTimeout(() => setStatus("idle"), 1600);
    return () => clearTimeout(hide);
  }, [status]);

  useEffect(() => {
    const onLeave = (event) => {
      const draft = draftRef.current;
      const saved = savedRef.current;
      if (draft.question === saved.question && draft.answer === saved.answer) {
        return;
      }
      event.preventDefault();
      event.returnValue = "";
      persist();
    };
    window.addEventListener("beforeunload", onLeave);
    return () => {
      window.removeEventListener("beforeunload", onLeave);
      clearTimeout(timerRef.current);
      if (removedRef.current) return;
      const draft = draftRef.current;
      const saved = savedRef.current;
      if (draft.question === saved.question && draft.answer === saved.answer) {
        return;
      }
      updateCardText(email, deckId, card.id, draft)
        .then(() => onUpdate?.(card.id, draft))
        .catch((saveError) => console.error("Error saving card:", saveError));
    };
  }, [card.id, deckId, email, onUpdate, persist]);

  const deleteCard = async () => {
    if (deleting) return;
    clearTimeout(timerRef.current);
    removedRef.current = true;
    setDeleting(true);
    try {
      await deleteCardFromDeck(email, deckId, card.id);
      onDelete?.(card.id);
    } catch (deleteError) {
      console.error("Error deleting card:", deleteError);
      removedRef.current = false;
      setDeleting(false);
      setConfirmDelete(false);
      setStatus("error");
    }
  };

  const statusLabel =
    status === "saving"
      ? "Saving…"
      : status === "saved"
        ? "Saved"
        : status === "error"
          ? "Couldn’t save"
          : "";

  return (
    <li className="preview-item">
      <span className="preview-item__index">
        {String(index + 1).padStart(2, "0")}
      </span>
      <div className="preview-item__body">
        <div className="preview-item__field">
          <span className="preview-item__field-head">
            <small>Question</small>
            <span className="preview-item__actions">
              {statusLabel ? (
                <em
                  className={`preview-item__save preview-item__save--${status}`}
                >
                  {statusLabel}
                </em>
              ) : null}
              {confirmDelete ? (
                <>
                  <button
                    className="preview-item__delete-cancel"
                    disabled={deleting}
                    onClick={() => setConfirmDelete(false)}
                    type="button"
                  >
                    Cancel
                  </button>
                  <button
                    className="preview-item__delete preview-item__delete--confirm"
                    disabled={deleting}
                    onClick={deleteCard}
                    type="button"
                  >
                    {deleting ? "Deleting…" : "Delete question"}
                  </button>
                </>
              ) : (
                <button
                  className="preview-item__delete"
                  disabled={deleting}
                  onClick={() => setConfirmDelete(true)}
                  type="button"
                >
                  Delete
                </button>
              )}
            </span>
          </span>
          <textarea
            aria-label={`Question ${index + 1}`}
            onBlur={persist}
            onChange={(event) => {
              setQuestion(event.target.value);
              scheduleSave();
            }}
            ref={questionRef}
            rows={1}
            spellCheck
            value={question}
          />
        </div>
        <label className="preview-item__field">
          <small>Answer</small>
          <textarea
            aria-label={`Answer ${index + 1}`}
            onBlur={persist}
            onChange={(event) => {
              setAnswer(event.target.value);
              scheduleSave();
            }}
            ref={answerRef}
            rows={1}
            spellCheck
            value={answer}
          />
          {showTags && (
            <div className="preview-item__meta preview-item__meta--footer">
              <span className="bucket-pill">Bucket {card.level}</span>
              <span className={`result-pill result-pill--${result.tone}`}>
                {result.label}
              </span>
              <span className={`due-pill due-pill--${due ? "due" : "resting"}`}>
                {due ? "Due now" : "Resting"}
              </span>
            </div>
          )}
        </label>
      </div>
    </li>
  );
}
